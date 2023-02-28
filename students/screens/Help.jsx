import React, { useContext, useEffect, useState } from "react";

// Dependencies
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

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

  console.log("Online TFs: ", OnlineTFs);

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

  console.log("Filtered TFs: ", filteredTFs);

  // Filter navigation
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <RightIcon
          name="filter"
          onPress={() =>
            navigation.navigate("Filter", {
              setFilteredTFs: setFilteredTFs,
            })
          }
          size={24}
          color={Colors.white}
        />
      ),
    });
  }, [navigation]);

  // Filter by tag

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View>
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
      </View>
      {/* Body */}
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={filteredTFs ? filteredTFs : OnlineTFs}
          renderItem={({ item }) => (
            <TFView TFs={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.uid}
        />
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
