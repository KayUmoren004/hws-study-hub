import NetInfo from "@react-native-community/netinfo";
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
} from "firebase/database";

// Config
import FirebaseConfig from "../config/FirebaseConfig";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

const useOnlinePresence = () => {
  // Context
  const [User] = useContext(UserContext);

  // Save user online status
  const saveUserOnlineStatus = async () => {
    const uid = User.uid;

    // Doc Ref with realtime
    const docRef = dbRef(realtime, `/online/${uid}`);

    // Set online status and console log
    await set(docRef, {
      isOnline: true,
      isTF: User.isTF,
      uid: uid,
      tags: User.tags,
    });

    // Set offline status and console log
    onDisconnect(docRef).remove();
  };

  // Watch network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        saveUserOnlineStatus();
      }
    });

    return unsubscribe;
  }, []);
};

export default useOnlinePresence;
