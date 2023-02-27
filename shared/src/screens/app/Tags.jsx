// TODO: Fix on back space search search

import { useState, useEffect, useContext } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
  Keyboard,
} from "react-native";

import { Divider } from "react-native-paper";
import { SearchBar } from "@rneui/themed";
import { Feather, Ionicons } from "@expo/vector-icons";

import Colors from "../../utils/Colors";

// Context
import { FirebaseContext } from "../../helpers/FirebaseContext";

// Firebase Modular Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  initializeAuth,
  sendEmailVerification,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  arrayRemove,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getDatabase,
  child,
  get,
  onValue,
  ref,
  query,
} from "firebase/database";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import FirebaseConfig from "../../helpers/config/FirebaseConfig";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const Tags = ({ navigation }) => {
  // Context
  const Firebase = useContext(FirebaseContext);

  // State
  const [listOfCourses, setListOfCourses] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [cloudTags, setCloudTags] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Get Majors and Minors
  const getCourses = async () => {
    try {
      const dataRef = ref(realtime, "majors-minors");
      onValue(dataRef, (snapShot) => {
        const data = snapShot.val();
        setListOfCourses(data);
      });
    } catch (err) {
      console.log("Error @TagSelector.getMajorsAndMinors: ", err.message);
    }
  };

  // Get Cloud Tags and listen for changes and update
  useEffect(() => {
    const uid = Firebase.Auth.getCurrentUser().uid;

    const docRef = doc(db, "users", uid);
    // const q = query(docRef, "tags", "==", "tags");

    // Get Cloud Tags and listen for changes and update
    const unSub = onSnapshot(docRef, (doc) => {
      // console.log("Current data: ", doc.data().tags);

      if (doc.exists()) {
        const data = doc.data();
        setCloudTags(data.tags);
      } else {
        console.log("No such document!");
      }
    });

    return () => unSub();
  }, []);

  // Save Tags
  const saveTags = async () => {
    setLoading(true);
    try {
      // Check for duplicates
      const newTags = findDulp(cloudTags, selectedTags);

      // Update Cloud Tags
      const uid = Firebase.Auth.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      // Delete "default" tag
      await Firebase.App.deleteDefaultTag();

      // Update tags
      await updateDoc(docRef, {
        tags: newTags,
      });

      // Clear Selected Tags
      setSelectedTags([]);

      // Close Modal
      navigation.goBack();
    } catch (err) {
      console.log("Error @TagSelector.saveTags: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Find Duplicates between two arrays and delete them
  const findDulp = (arr1, arr2) => {
    const duplicates = arr1.filter((value) => arr2.includes(value));
    arr1 = arr1.filter((value) => !duplicates.includes(value));
    arr2 = arr2.filter((value) => !duplicates.includes(value));
    return arr1.concat(arr2);
  };

  // Close
  const close = () => {
    Alert.alert(
      "Are you sure?",
      "You will lose all unsaved tags.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.goBack(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // Search
  const searchTags = (val) => {
    setSearch(val);

    const filtered = listOfCourses.filter((tag) => {
      if (search === "") {
        return listOfCourses;
      }

      return tag.toLowerCase().includes(search.toLowerCase());
    });

    setListOfCourses(filtered);
  };

  // Clear Search
  const clear = () => {
    setSearch("");
    getCourses();
  };

  // Call Functions on Mount
  useEffect(() => {
    getCourses();
  }, []);

  // Styles

  const isTagLocallySelected = (tag) => {
    return selectedTags.includes(tag);
  };
  const isTagInCloud = (tag) => {
    return cloudTags.includes(tag);
  };
  const bgColor = (tag) =>
    isTagLocallySelected(tag) || isTagInCloud(tag) || isTagLocallySelected(tag)
      ? Colors.bottleGreen
      : Colors.black;

  const pacity = (tag) =>
    isTagLocallySelected(tag) || isTagInCloud(tag) || isTagLocallySelected(tag)
      ? 1
      : 0;

  const fWeight = (tag) =>
    isTagLocallySelected(tag) || isTagInCloud(tag) || isTagLocallySelected(tag)
      ? "bold"
      : "normal";

  // Body
  const Body = () => {
    return (
      <>
        {listOfCourses &&
          listOfCourses.map((tag, idx) => (
            <View
              key={idx}
              style={{
                flex: 1,
                padding: 5,
              }}
            >
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.5 : 1.0 },
                  {
                    padding: 15,
                    marginVertical: 10,
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: bgColor(tag),
                  },
                ]}
                onPress={async () => {
                  // If tag is in cloud and not locally selected, delete it from cloud and add it to local
                  if (isTagInCloud(tag) && !isTagLocallySelected(tag)) {
                    // Delete tag from cloud
                    const deleted = await Firebase.App.deleteTag(tag);

                    if (deleted) {
                      console.log("Deleted: ", tag);
                    } else {
                      console.log("Error deleting: ", tag);
                    }
                  }
                  // If tag is in cloud and locally selected, remove it from both and reset it's styles
                  if (isTagLocallySelected(tag) && isTagInCloud(tag)) {
                    setSelectedTags(
                      selectedTags.filter((item) => item !== tag)
                    );

                    // Delete tag from cloud
                    const deleted = await Firebase.deleteTag(tag);

                    if (deleted) {
                      console.log("Deleted: ", tag);
                    } else {
                      console.log("Error deleting: ", tag);
                    }
                  }

                  // If tag is not in cloud and not locally selected, add it to local
                  if (!isTagLocallySelected(tag) && !isTagInCloud(tag)) {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                onPressIn={() => {
                  // Reset styles
                  // if (!isTagLocallySelected(tag) && !isTagInCloud(tag)) {
                  //   bgColor(tag);
                  //   pacity(tag);
                  //   fWeight(tag);
                  // }

                  if (isTagLocallySelected(tag)) {
                    // bgColor(tag);
                    // pacity(tag);
                    // fWeight(tag);

                    // Delete tag from local
                    setSelectedTags(
                      selectedTags.filter((item) => item !== tag)
                    );
                  }

                  // if (!isTagLocallySelected(tag) && isTagInCloud(tag)) {
                  //   bgColor(tag);
                  //   pacity(tag);
                  //   fWeight(tag);
                  // }
                }}
                onPressOut={() => {
                  // Reset styles
                  if (isTagLocallySelected(tag)) {
                    // bgColor(tag);
                    // pacity(tag);
                    // fWeight(tag);

                    // Delete tag from local
                    setSelectedTags(
                      selectedTags.filter((item) => item !== tag)
                    );
                  }
                }}
              >
                <Text style={{ color: "#fff", fontWeight: fWeight(tag) }}>
                  {tag}
                </Text>
                <Feather
                  name="check-circle"
                  color="#fff"
                  size={20}
                  style={{ opacity: pacity(tag) }}
                />
              </Pressable>
              <Divider
                style={{
                  width: "100%",
                }}
              />
            </View>
          ))}
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 30,
          flexDirection: "row",
        }}
      >
        {/* Close Button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={{}} onPress={() => close()}>
            <View
              style={{
                color: Colors.lavenderBlue,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="close"
                size={30}
                style={{
                  color: "#FF0000",
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search for Courses"
          onChangeText={searchTags}
          value={search}
          platform="ios"
          containerStyle={{ backgroundColor: "#000", padding: 15 }}
          cancelButtonProps={{ marginRight: 10 }}
          cancelButtonTitle="Cancel"
          onClear={() => clear()}
          onCancel={() => clear()}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            listOfCourses.length === 0 && Alert.alert("No results found.");
          }}
        />
      </View>
      {/* Divider */}
      <Divider style={{ marginTop: 10 }} />
      {/* Body */}
      <ScrollView>
        <Body />
      </ScrollView>
      {/* Footer */}
      <View
        style={{
          paddingHorizontal: 30,
        }}
      >
        {loading && <Loading />}
        {!loading && (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              //flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
              height: 50,
            }}
            onPress={() => saveTags()}
          >
            <Text style={{ color: "#000", textAlign: "center" }}>
              Save Tags
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Tags;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
