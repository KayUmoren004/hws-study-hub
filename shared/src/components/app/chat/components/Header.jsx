import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Colors from "../../../../utils/Colors";

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

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

const Header = ({ navigation, person, faceTime, phoneNumber, num }) => {
  // State
  const [status, setStatus] = React.useState("");

  // Listen for status of person
  useLayoutEffect(() => {
    // side effects
    const unSub = onValue(dbRef(realtime, `online`), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data[person.uid]) {
          setStatus("Online");
        } else {
          setStatus("Offline");
        }
      }
    });

    // cleanup
    return () => {
      unSub();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        flexDirection: "row",

        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        // marginVertical: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        {/* Back */}
        <TouchableOpacity
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 10,
            marginRight: 20,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={40} color="#fff" />
        </TouchableOpacity>
        {/* Photo & Title */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Chat Person", { person: person })}
        >
          {/* Profile Photo */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Image
              source={
                person.profilePhotoUrl === "default"
                  ? require("../../../../../../assets/icon.png")
                  : { uri: person.profilePhotoUrl }
              }
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              {person.name}
            </Text>
            <Text
              style={{
                color:
                  status === "Online" ? Colors.bottleGreen : Colors.darkGray,
                fontSize: 12,
                marginTop: 5,
              }}
            >
              {status}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Options */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                num === undefined
                  ? alert(
                      "You need to add a phone number to your profile first"
                    )
                  : phoneNumber(num)
              }
              // disabled={num === undefined ? true : false}
            >
              <Feather
                style={{ marginRight: 20 }}
                name="phone"
                size={25}
                color={num === undefined ? "#ffffff40" : "#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                num === undefined
                  ? alert(
                      "You need to add a phone number to your profile first"
                    )
                  : faceTime(num)
              }
              // disabled={num === undefined ? true : false}
            >
              <Feather
                style={{ marginRight: 20 }}
                name="video"
                size={25}
                color={num === undefined ? "#ffffff40" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
