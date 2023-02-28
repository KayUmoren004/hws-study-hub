import React, { useEffect, useState } from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";

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
import FirebaseConfig from "../../shared/src/helpers/config/FirebaseConfig";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);

const Home = () => {
  // State
  const [requestForHelp, setRequestForHelp] = useState(null);

  // Listen for changes in "requestForHelp" collection in firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "requestForHelp"),
        (querySnapshot) => {
          const requestForHelp = [];
          querySnapshot.forEach((doc) => {
            // Convert timestamp to date
            const createdAt = doc.data().createdAt.toDate();
            requestForHelp.push({ ...doc.data(), createdAt });
          });
          setRequestForHelp(requestForHelp);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.log("Error @ Home.jsx: ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>TF Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
