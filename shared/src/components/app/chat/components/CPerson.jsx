// Person but different. I don't know why. Only see this screen when the person is clicked in the chat screen

import React, { useContext, useLayoutEffect, useState } from "react";

// Dependencies
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import Colors from "../../../../utils/Colors";
import Delimitated from "../../Tag/Delimitated";
import { Feather } from "@expo/vector-icons";
import Status from "../../picker/Status";
import Button from "../../Button";

// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
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
  addDoc,
} from "firebase/firestore";
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
  serverTimestamp as dbServerTimestamp,
  orderByChild,
  limitToLast,
  update,
} from "firebase/database";
import FirebaseConfig from "../../../../helpers/config/FirebaseConfig";
import { UserContext } from "../../../../helpers/UserContext";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

const s = ["Open", "Pending", "In Progress", "Completed"];

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const CPerson = ({ navigation, route }) => {
  // Params
  const { person } = route.params;

  // Context
  const [User] = useContext(UserContext);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [pickerSeen, setPickerSeen] = useState(false);
  const [pick, setPick] = useState(s[0]);

  // console.log("person: ", person);

  const returnUID = () => {
    let uid;

    if (User.isTF === true) {
      uid = `${User.uid}-${person.uid}`;
    } else {
      uid = `${person.uid}-${User.uid}`;
    }

    return uid;
  };

  // On Mount, set the pick
  useLayoutEffect(() => {
    // Collection Reference
    const collectionRef = collection(db, "requestForHelp");

    const unSubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      // Find the document id that matches the returnUID
      querySnapshot.forEach((doc) => {
        if (doc.id === returnUID()) {
          setPick(doc.data().status);
          // console.log("CPerson: ", doc.data().status);
        }
      });
    });

    return () => {
      unSubscribe();
    };
  }, [navigation]);

  // Update the status
  const updateStatus = async (status) => {
    // Document Reference
    const docRef = doc(db, "requestForHelp", returnUID());

    // Update the status
    await updateDoc(docRef, {
      status: status,
    });

    // Close the picker
    setPickerSeen(false);

    // Set the pick
    setPick(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Profile Photo and Name */}
        <View>
          {/* Profile Photo */}
          <View
            style={{
              // shadowOpacity: 0.5,
              marginTop: 15,
              shadowRadius: 30,
              shadowColor: "#d2d2d2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                person.photo === "default"
                  ? require("../../../../../../assets/icon.png")
                  : { uri: person.profilePhotoUrl }
              }
              style={{
                width: 128,
                height: 128,
                borderRadius: 64,
              }}
              resizeMode="contain"
            />
          </View>
          {/* Name and Status */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
              {person.name}
            </Text>
            <Text
              style={{
                color: Colors.bottleGreen,
                fontSize: 20,
                fontWeight: "200",
              }}
            >
              {person.status}
            </Text>
          </View>
        </View>

        {/* Middler */}
        <View
          style={{
            flex: 1,
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          {/* Courses */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "flex-start",
              // marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            {/* Courses */}
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              Courses
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {person.tags.map((course, idx) => {
                // Ignore the "default" tag
                if (course === "default") return null;
                return <Delimitated key={idx} tag={course} />;
              })}
            </View>
          </View>

          {/* Picker */}
          <Modal
            animationType="slide"
            visible={pickerSeen}
            transparent={true}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setPickerSeen(!pickerSeen);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Status
                selectedValue={pick}
                setPick={setPick}
                onClose={() => {
                  updateStatus(pick);
                }}
                status={s}
              />
            </View>
          </Modal>

          {/* Stats */}
          {!person.isTF ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
                // marginVertical: 20,
              }}
            >
              {/* Set Help Status */}
              <View
                style={{
                  marginVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "200",
                  }}
                >
                  Current Status:{" "}
                  <Text
                    style={{
                      color:
                        pick === "Open"
                          ? Colors.lavenderBlue
                          : pick === "Pending"
                          ? Colors.yellow
                          : pick === "In Progress"
                          ? Colors.orange
                          : pick === "Completed"
                          ? Colors.bottleGreen
                          : "#fff",
                      fontSize: 20,
                      fontWeight: "200",
                    }}
                  >
                    {pick}
                  </Text>
                </Text>
              </View>
              <Button
                label="Set Help Status"
                onPress={() => setPickerSeen(true)}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // marginHorizontal: 10,
                // marginVertical: 20,
              }}
            >
              {/* Stats */}
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Stats
              </Text>
              {/* Stats  */}
              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  Total Helped: {person.totalHelped}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CPerson;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
