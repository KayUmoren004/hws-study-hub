import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getReactNativePersistence } from "firebase/auth/react-native";

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
  addDoc,
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

// Config
import FirebaseConfig from "./config/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Initialize Firebase
let app, auth, db, storage, realtime;

// Fix for AsyncStorage Warning
if (getApps().length < 1) {
  app = initializeApp(FirebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
  storage = getStorage(app);
  realtime = getDatabase(app);
} else {
  // Firebase Modular Variables
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  realtime = getDatabase(app);
}

const Auth = {
  // Get Current User
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Check if User is Logged In
  checkAuth: (user) => {
    return onAuthStateChanged(auth, user);
  },

  // Get User Info
  getUserData: async (uid) => {
    try {
      const docRef = await doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.log("Error @Firebase.getUserInfo: ", err.message);
    }
  },

  // Update User data
  updateUserData: async (uid, user) => {
    try {
      await updateDoc(doc(db, "users", uid), user);

      return true;
    } catch (err) {
      console.log("Error @Firebase.updateUserData: ", err.message);
      return false;
    }
  },
  // Upload Profile Photo
  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid;
    try {
      console.log("Init, ", uri);
      const photo = await Firebase.getBlob(uri);
      console.log("Modified URI: ", photo);
      // const photo = await fetch(uri).then((r) => r.blob());
      console.log("0");
      const imageRef = ref(storage, `profilePhotos/${uid}/p-photo`);
      console.log("1");
      await uploadBytes(imageRef, photo);
      console.log("2");

      const url = await getDownloadURL(imageRef);
      console.log("3");

      await updateDoc(doc(db, "users", uid), {
        profilePhotoUrl: url,
      });
      console.log("4");

      return url;
    } catch (err) {
      console.log("Error @Firebase.uploadProfilePhoto: ", err.message);
    }
  },

  // Get blob from uri
  getBlob: async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        resolve(xhr.response);
      };

      xhr.onerror = () => {
        reject(new Error("Network request failed"));
      };

      // Replace "file://" with "" if platform is ios

      const modifiedURI = Platform === "ios" ? uri.replace("file://", "") : uri;

      xhr.responseType = "blob";
      xhr.open("GET", modifiedURI, true);
      xhr.send(null);
    });
  },

  // Sign Up with Email and Password
  createUser: async (user) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.actualPassword
      );
      const uid = Firebase.getCurrentUser().uid;
      let profilePhotoUrl = "default";
      await setDoc(doc(db, "users", uid), {
        name: user.name,
        email: user.email,
        // phoneNumber: user.phoneNumber,
        uid: uid,
        profilePhotoUrl: profilePhotoUrl,
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: serverTimestamp(),
        tags: ["default"],
        totalHelped: 0,
      });
      if (user.profilePhoto) {
        profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto);
      }

      delete user.actualPassword;

      return { ...user, profilePhotoUrl, uid };
    } catch (err) {
      console.log("Error @Firebase.createUser: ", err.message);
      alert(err.message);
    }
  },

  // Sign In with Email and Password
  signIn: async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("Error @Firebase.signIn: ", err.message);
    }
  },

  // Sign Out
  signOut: async () => {
    try {
      await signOut(auth);

      return true;
    } catch (err) {
      console.log("Error @Firebase.signOut: ", err.message);
    }
    return false;
  },

  // Reset Password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);

      return true;
    } catch (err) {
      console.log("Error @Firebase.resetPassword: ", err.message);
    }
  },

  // Verify Email
  verifyEmail: async () => {
    try {
      const user = Firebase.getCurrentUser();
      await sendEmailVerification(user);

      return true;
    } catch (err) {
      console.log("Error @Firebase.verifyEmail: ", err.message);
    }
  },

  // Delete User
  deleteUser: async (uid) => {
    try {
      await deleteDoc(doc(db, "users", uid));

      return true;
    } catch (err) {
      console.log("Error @Firebase.deleteUser: ", err.message);
    }
  },
};

const App = {
  // Get Majors and Courses from Firebase Realtime Database
  getMajorsAndMinors: async () => {
    try {
      // Pass firebase realtime database references

      return {
        db: realtime,
        ref: dbRef,
        child,
        get,
        onValue,
        query,
        set,
        onDisconnect,
        remove,
      };
    } catch (err) {
      console.log("Error @Firebase.addCourse: ", err.message);
    }
  },

  // Get All Tags from User Profile
  getAllTags: async () => {
    try {
      const uid = Firebase.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().tags;
      }

      // If "default" tag exists, delete it
      if (docSnap.data().tags.includes("default")) {
        await Firebase.deleteDefaultTag();
      }
    } catch (err) {
      console.log("Error @Firebase.getAllTags: ", err.message);
    }
  },

  // Refresh to get updated tags
  refreshTags: async () => {
    try {
      const uid = Firebase.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().tags;
      }
    } catch (err) {
      console.log("Error @Firebase.refreshTags: ", err.message);
    }
  },

  // Delete Tag from User Profile
  deleteTag: async (tag) => {
    try {
      const uid = Firebase.Auth.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      await updateDoc(docRef, {
        tags: arrayRemove(tag),
      });

      return true;
    } catch (err) {
      console.log("Error @Firebase.deleteTag: ", err.message);
    }
  },

  // Add Tags to User Profile
  addTags: async (tags) => {
    try {
      const uid = Firebase.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      // Delete "default" tag from User Profile
      await App.deleteDefaultTag();

      // Get all tags from user profile
      const currentTags = await Firebase.getAllTags();

      // Check if tags exist in both currentTags and tags
      const intersection = currentTags.filter((tag) => tags.includes(tag));

      // If tags exist in both currentTags and tags, remove them from tags
      if (intersection.length > 0) {
        tags = tags.filter((tag) => !intersection.includes(tag));
      }

      // Add tags to user profile
      await updateDoc(docRef, {
        tags: arrayUnion(...tags),
      });

      // await updateDoc(docRef, {
      //   tags: ,
      // });

      return true;
    } catch (err) {
      console.log("Error @Firebase.addTags: ", err.message);
    }
  },

  // Delete "default" tag from User Profile
  deleteDefaultTag: async () => {
    try {
      const uid = Firebase.Auth.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      await updateDoc(docRef, {
        tags: arrayRemove("default"),
      });

      return true;
    } catch (err) {
      console.log("Error @Firebase.deleteDefaultTag: ", err.message);
    }
  },

  // Send all modular imports
  modularImports: async () => {
    try {
      return {
        auth,
        db,
        realtime,
        storage,
        app,
      };
    } catch (err) {
      console.log("Error @Firebase.modularImports: ", err.message);
    }
  },

  // Get Request for Help based on tags
  getRequestForHelp: async (tags) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "requestForHelp"),
          where("tags", "array-contains-any", tags)
        )
      );

      const requestForHelp = [];

      querySnapshot.forEach((doc) => {
        requestForHelp.push({ ...doc.data(), id: doc.id });
      });

      return requestForHelp;
    } catch (err) {
      console.log("Error @Firebase.getRequestForHelp: ", err.message);
    }
  },

  // Get Help Request based on one tag
  getHelpRequest: async (tag) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "requestForHelp"), where("tag", "==", tag))
      );

      const helpRequest = [];

      querySnapshot.forEach((doc) => {
        helpRequest.push({ ...doc.data(), id: doc.id });
      });

      return helpRequest;
    } catch (err) {
      console.log("Error @Firebase.getHelpRequest: ", err.message);
    }
  },

  // Create Shared UID
  createSharedUID: (uid1, uid2) => {
    return `${uid1}-${uid2}`;
  },

  // Request for Help
  requestForHelp: async (title, description, tfUID) => {
    try {
      const uid = Firebase.Auth.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data();

        // Get TF User
        const tf = await getDoc(doc(db, "users", tfUID));

        await setDoc(
          doc(db, "requestForHelp", App.createSharedUID(tfUID, user.uid)),
          {
            title,
            description,
            tfUID: tfUID,
            requestor: user,
            tf: tf.data(),
            createdAt: serverTimestamp(),
          }
        );

        return true;
      }
    } catch (err) {
      console.log("Error @Firebase.requestForHelp: ", err.message);
    }
  },

  // Get all online users in "/online" in realtime database
  getOnlineUsers: async () => {
    try {
      const onlineRef = dbRef(realtime, "online/");
      onValue(onlineRef, (snapshot) => {
        return snapshot;
      });
    } catch (err) {
      console.log("Error @Firebase.getOnlineUsers: ", err.message);
    }
  },
};

const Firebase = {
  Auth,
  App,
};

export default Firebase;
