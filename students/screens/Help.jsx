import React, { useContext, useEffect, useState } from "react";

// Dependencies
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

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

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);
const realtime = getDatabase(app);
const firestore = getFirestore(app);

const Help = () => {
  // Context
  const [User] = useContext(UserContext);

  // State
  const [OnlineTFs, setOnlineTFs] = useState(null);

  // Get all online TFs
  const getOnlineTFs = async () => {
    try {
      const onlineRef = dbRef(realtime, "online/");
      onValue(onlineRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // For every online user, find their user data
          const onlineUsers = Object.keys(data).map(async (uid) => {
            const user = await findUser(uid);
            return user;
          });
          // Set state
          Promise.all(onlineUsers).then((users) => {
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

  // Filter by tag

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View>
        <Text style={{ color: "#fff" }}>Online Now</Text>
        <Text style={{ color: "#fff" }}>{OnlineTFs[0].email}</Text>
      </View>
      {/* Body */}
      <View>
        <Text style={{ color: "#fff" }}>Help</Text>
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
