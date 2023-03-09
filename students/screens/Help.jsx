import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

// Dependencies
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
  Button,
} from "react-native";

import { UserContext } from "../../shared/src/helpers/UserContext";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDatabase,
  child,
  get,
  onValue,
  ref as dbRef,
  query,
  push,
  onChildAdded,
  off,
  set,
  onDisconnect,
  remove,
} from "firebase/database";

import FirebaseConfig from "../../shared/src/helpers/config/FirebaseConfig";
import RightIcon from "../../shared/src/components/app/RightIcon";
import Colors from "../../shared/src/utils/Colors";
import TFView from "../../shared/src/components/app/TFView";
import Tags from "../../shared/src/components/app/picker/Tags";
import { Feather } from "@expo/vector-icons";

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);
const realtime = getDatabase(app);
const firestore = getFirestore(app);

const Help = ({ navigation }) => {
  // Context
  const [User] = useContext(UserContext);

  // State
  const [OnlineTFs, setOnlineTFs] = useState(null);
  const [filteredTFs, setFilteredTFs] = useState(null);
  const [pickerState, setPickerState] = useState(false);
  const [pick, setPick] = useState(User.tags[0]);

  // Get all online TFs
  const getOnlineTFs = async () => {
    try {
      const onlineRef = dbRef(realtime, "online/");
      onValue(onlineRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // For every online user with isTF === true, find their user data
          const onlineTFs = Object.keys(data)
            .filter((uid) => data[uid].isTF)
            .map((uid) => findUser(uid));
          Promise.all(onlineTFs).then((users) => {
            setOnlineTFs(users);
          });
        } else {
          setOnlineTFs(null);
        }
      });
    } catch (err) {
      console.log("Error @Help.getOnlineUsers: ", err.message);
    }
  };

  // Find user in firestore given uid
  const findUser = async (uid) => {
    try {
      const userDoc = doc(firestore, "users", uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error @Help.findUser: ", err.message);
    }
  };

  // Get all online TFs on mount
  useEffect(() => {
    getOnlineTFs();
  }, []);

  // Filter navigation
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => navigation.navigate("Tags")}
          >
            <Feather name="plus" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              setPickerState(true);
            }}
          >
            <Feather name="filter" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Filter by tag
  const filterByTag = (tag) => {
    // Check if tag is "All"
    if (tag === "All") {
      setFilteredTFs(null);
    } else {
      // Filter by tag
      const filtered = OnlineTFs.filter((user) => user.tags.includes(tag));
      setFilteredTFs(filtered);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Colors.bottleGreen,
            fontSize: 24,
            fontWeight: "bold",
            padding: 10,
            marginLeft: 5,
          }}
        >
          Online Now
        </Text>
        {filteredTFs && (
          <Button
            title="Clear Filters"
            onPress={() => {
              setFilteredTFs(null);
              setPickerState(false);
            }}
          />
        )}
      </View>
      {/* Body */}
      <View
        style={{
          flex: 1,
        }}
      >
        {/* Picker */}
        <Modal
          animationType="slide"
          visible={pickerState}
          transparent={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setPickerSeen(!pickerState);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tags
              selectedValue={pick}
              setPick={setPick}
              tags={User.tags}
              onClose={() => {
                setPickerState(false);
                filterByTag(pick);
              }}
              onBlur={() => {
                setPickerState(false);
                filterByTag(pick);
              }}
            />
          </View>
        </Modal>
        {filteredTFs?.length == 0 && pickerState == false ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              No {pick} TF is online
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTFs ? filteredTFs : OnlineTFs}
            renderItem={({ item }) => (
              <TFView TFs={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.uid}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
