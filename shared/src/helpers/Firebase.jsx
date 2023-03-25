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
  deleteUser,
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
  limitToLast,
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
  serverTimestamp as dbServerTimestamp,
  orderByChild,
  update,
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
      // Look though the user object and remove any keys that are null or undefined
      for (const key in user) {
        if (user[key] === null || user[key] === undefined) {
          delete user[key];
        }
      }

      // Update the user data
      await updateDoc(doc(db, "users", uid), user);

      return true;
    } catch (err) {
      console.log("Error @Firebase.updateUserData: ", err.message);
      return false;
    }
  },
  // Upload Profile Photo
  uploadProfilePhoto: async (uri) => {
    const uid = Auth.getCurrentUser().uid;
    try {
      console.log("Init, ", uri);
      const photo = await Auth.getBlob(uri);
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
      const uid = Auth.getCurrentUser().uid;
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
        localPhotoUrl: user.localPhotoUrl,
      });
      if (user.profilePhoto) {
        profilePhotoUrl = await Auth.uploadProfilePhoto(user.profilePhoto);
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
      const user = Auth.getCurrentUser();
      await sendEmailVerification(user);

      return true;
    } catch (err) {
      console.log("Error @Firebase.verifyEmail: ", err.message);
    }
  },

  // Delete User
  deleteUserData: async (uid) => {
    try {
      // Get Current User
      const user = Auth.getCurrentUser();

      // Delete User Data
      await deleteDoc(doc(db, "users", uid));

      // Delete User Auth
      await deleteUser(user);

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

  // Add User Request to Pending
  addUserRequestToPending: async (title, description, tfUID) => {
    try {
      const uid = Firebase.Auth.getCurrentUser().uid;
      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data();

        // Get TF User
        const tf = await getDoc(doc(db, "users", tfUID));

        // Shared UID
        const sharedUID = App.createSharedUID(tfUID, user.uid);

        // TF User Queue Ref
        const pendingRequestRef = doc(db, "users", uid, "requests", sharedUID);

        await setDoc(pendingRequestRef, {
          title,
          description,
          tfUID: tfUID,
          requestor: user,
          tf: tf.data(),
          createdAt: serverTimestamp(),
          status: "Open",
          sharedUID: sharedUID,
        });

        return true;
      }
    } catch (err) {
      console.log("Error @Firebase.addUserRequestToPending: ", err.message);
    }
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

        // Shared UID
        const sharedUID = App.createSharedUID(tfUID, user.uid);

        // TF User Queue Ref
        const tfQueueDocRef = doc(db, "users", tfUID, "queue", sharedUID);

        await setDoc(tfQueueDocRef, {
          title,
          description,
          tfUID: tfUID,
          requestor: user,
          tf: tf.data(),
          createdAt: serverTimestamp(),
          status: "Open",
          sharedUID: sharedUID,
        });

        // Add a reference to this request to the "requestForHelp" collection
        const requestForHelpDocRef = doc(db, "requestForHelp", sharedUID);

        await setDoc(requestForHelpDocRef, {
          title,
          description,
          tfUID: tfUID,
          requestor: user,
          tf: tf.data(),
          createdAt: serverTimestamp(),
          status: "Open",
          sharedUID: sharedUID,
        });

        return true;
      }
    } catch (err) {
      console.log("Error @Firebase.requestForHelp: ", err.message);
    }
  },

  // Set Status of Request
  setStatus: async (sharedUID, status) => {
    try {
      // const uid = Firebase.Auth.getCurrentUser().uid;

      // Deconstruct sharedUID to get uid1 and uid2
      const [uid1, uid2] = sharedUID.split("-");
      const docRef1 = doc(db, "users", uid1, "queue", sharedUID);
      const docRef2 = doc(db, "users", uid2, "requests", sharedUID);
      const docRef3 = doc(db, "requestForHelp", sharedUID);

      await updateDoc(docRef1, {
        status: status,
      });

      await updateDoc(docRef2, {
        status: status,
      });

      await updateDoc(docRef3, {
        status: status,
      });

      return true;
    } catch (err) {
      console.log("Error @Firebase.setStatus: ", err.message);
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

const Messages = {
  // Create Unread Message
  createUnreadMessage: async (unread) => {
    try {
      // Get current value of unread object
      const unreadPreRef = dbRef(
        realtime,
        "users/" + `${unread.receiverUID}/` + unread.chatRoomId
      );
      const unreadPreSnap = await get(unreadPreRef);
      const unreadPre = unreadPreSnap.val();
      let u = [];

      console.log("unreadPre: ", unreadPre);

      // Push elements unreadPre to u
      if (unreadPre) {
        unreadPre.unread.forEach((item) => {
          u.push(item);
        });
      } else {
        u = [];
      }

      // Push unread.key to u
      u.push(unread.key);

      // console.log("u: ", u);

      // Create unread object
      const obj = {
        receiverUID: unread.receiverUID,
        unread: u,
      };

      // Handle read status
      const unreadRef = dbRef(
        realtime,
        "users/" + `${obj.receiverUID}/` + unread.chatRoomId
      );
      // Update unread object
      await set(unreadRef, obj);
    } catch (err) {
      console.log("Error @Messages.createUnreadMessage: ", err.message);
    }
  },

  // Send a message
  sendMessage: async (messages) => {
    messages.forEach(async (item) => {
      try {
        // Deconstruct chatRoomId
        const [receiverUID, senderUID] = item.chatRoomId.split("-");

        // Create message object
        const message = {
          message: item.message,
          timeStamp: dbServerTimestamp(),
          user: item.user,
          chatRoomId: item.chatRoomId,
          read: false,
          senderUID: item.user._id === senderUID ? senderUID : receiverUID,
          receiverUID: item.user._id === senderUID ? receiverUID : senderUID,
        };

        const massageRef = dbRef(realtime, "messages/" + message.chatRoomId);

        // Get Document key of the pushed message
        const key = await push(massageRef, message).key;

        // update message just sent with key
        await update(
          dbRef(realtime, "messages/" + message.chatRoomId + "/" + key),
          { key: key }
        );

        // Create unread object
        const unread = {
          receiverUID: message.receiverUID,
          key: key,
          chatRoomId: message.chatRoomId,
        };

        // Create unread message
        await Messages.createUnreadMessage(unread);
      } catch (err) {
        console.log("Error @Firebase.sendMessage: ", err.message);
      }
    });
  },

  // Parse messages
  parseMessages: (message) => {
    const { user, message: text, timeStamp, chatRoomId, read } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timeStamp);
    const isRead = read;

    return {
      _id,
      createdAt,
      text,
      user,
      chatRoomId,
      isRead,
    };
  },

  // Get messages
  getMessages: async (callback, chatRoomId) => {
    try {
      const messageRef = dbRef(realtime, "messages/" + chatRoomId);

      onChildAdded(messageRef, (snapshot) =>
        callback(Messages.parseMessages(snapshot))
      );
    } catch (err) {
      console.log("Error @Firebase.getMessages: ", err.message);
    }
  },

  // Off messages
  offMessages: async (chatRoomId) => {
    try {
      const messageRef = dbRef(realtime, "messages/" + chatRoomId);

      off(messageRef);
    } catch (err) {
      console.log("Error @Firebase.offMessages: ", err.message);
    }
  },

  // Deconstruct Shared UID
  deconstructSharedUID: (sharedUID) => {
    var middle = sharedUID.indexOf("-");
    var uid1 = sharedUID.substring(0, middle);
    var uid2 = sharedUID.substring(middle + 1, sharedUID.length);

    return {
      uid1,
      uid2,
    };
  },

  // Get Last Message
  getLastMessage: async (chatRoomId) => {
    try {
      const messagesRef = ref(getDatabase(), `messages/${chatRoomId}`);
      const messagesSnapshot = await get(
        orderByChild(messagesRef, "timeStamp"),
        limitToLast(messagesRef, 1)
      );

      const messages = messagesSnapshot.val();

      // Get the last (and only) message from the snapshot
      const messageId = Object.keys(messages)[0];
      const message = messages[messageId];

      return message;
    } catch (err) {
      console.log("Error @Messages.getLastMessage: ", err.message);
      return null;
    }
  },

  // Get Chat Room
  getChatRoom: async (partialUID) => {
    try {
      // Get all conversations
      const conversations = await Messages.getConversations();

      // Conversations that contain the partialUID
      const filteredConversations = [];

      var usr1, usr2;

      // For each conversation, deconstruct the sharedUID and check if it contains the partialUID
      for (let i = 0; i < conversations.length; i++) {
        const { uid1, uid2 } = Messages.deconstructSharedUID(conversations[i]);

        // Save the user data of uid1 and uid2
        usr1 = await Auth.getUserData(uid1);
        usr2 = await Auth.getUserData(uid2);

        if (uid1 === partialUID || uid2 === partialUID) {
          filteredConversations.push(conversations[i]);
        }
      }

      // Find Current User
      const currentUser = Firebase.Auth.getCurrentUser();

      // Create a new array of conversations that contains the id: child.key, name: otherUser.name, message: lastMessage, time: lastMessage.timeStamp, profilePhotoURL: otherUser.profilePhotoUrl,
      const conversationsWithUserData = await Promise.all(
        filteredConversations.map(async (conversation) => {
          const { uid1, uid2 } = Messages.deconstructSharedUID(conversation);

          const otherUserData = currentUser.uid === uid1 ? usr2 : usr1;

          const lastMessage = await Messages.getLastMessage(conversation.key);

          return {
            id: conversation.key,
            name: otherUserData.name,
            message: lastMessage.message,
            time: new Date(lastMessage.timeStamp.toMillis()).toLocaleString(),
            profilePhotoURL: otherUserData.profilePhotoUrl,
          };
        })
      );

      return conversationsWithUserData;
    } catch (err) {
      console.log("Error @Firebase.getChatRoom: ", err.message);
      return null;
    }
  },

  // Get all conversations from firebase realtime database. This function will return an array of Keys (sharedUIDs) of all conversations
  getConversations: async () => {
    try {
      const conversationsRef = dbRef(realtime, "messages/");
      const conversations = [];
      onValue(conversationsRef, (snapshot) => {
        snapshot.forEach((child) => {
          const sUID = child.key;
          conversations.push(sUID);
          // conversations.push(child.key);
        });
      });

      console.log("Messages: ", conversations);
      return conversations;
    } catch (err) {
      console.log("Error @Firebase.getConversations: ", err.message);
    }
  },
};

const Firebase = {
  Auth,
  App,
  Messages,
};

export default Firebase;

// const messagesRef = dbRef(realtime, "messages/");
// const snapshot = await get(children(messagesRef));

// const conversations = [];

// snapshot.forEach((child) => {
//   const { uid1, uid2 } = Messages.deconstructSharedUID(child.key);

//   // Get user 1
//   const user1 = Firebase.Auth.getUserData(uid1);

//   // Get user 2
//   const user2 = Firebase.Auth.getUserData(uid2);

//   // Determine which user is the current user
//   const currentUser = Firebase.Auth.getCurrentUser();
//   const otherUser = currentUser.uid === uid1 ? user2 : user1;

//   // Get last message
//   const lastMessage = getDoc(doc(db, "messages", child.key, child.val().key));

//   // Push to conversations
//   conversations.push({
//     id: child.key,
//     name: otherUser.name,
//     message: lastMessage,
//     time: lastMessage.timeStamp,
//     profilePhotoURL: otherUser.profilePhotoUrl,
//     // unread:
//   });
// });
