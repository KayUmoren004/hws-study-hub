import React, { useContext, useEffect } from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";
import Chats from "../../components/app/chat/Chats";
import { FirebaseContext } from "../../helpers/FirebaseContext";
import { UserContext } from "../../helpers/UserContext";
import moment from "moment";

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
} from "firebase/database";
import FirebaseConfig from "../../../../shared/src/helpers/config/FirebaseConfig";
import Functions from "../../helpers/Functions";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

const Chat = ({ navigation }) => {
  // State
  const [data, setData] = React.useState([]);
  const [conversations, setConversations] = React.useState([]);
  const [fConversations, setFconversations] = React.useState([]);
  const [chatRooms, setChatRooms] = React.useState([]);

  // Context
  const Firebase = useContext(FirebaseContext);
  const [User] = useContext(UserContext);

  // On mount get conversations
  useEffect(() => {
    try {
      const getData = async () => {
        onValue(dbRef(realtime, "messages/"), (snapshot) => {
          // If there are no chat rooms, return
          if (!snapshot.val()) {
            return;
          }

          const alpha = snapshot.val();
          const chatRooms = Object.keys(alpha).filter((key) => {
            return key.includes(User.uid);
          });
          setChatRooms(chatRooms);

          const newData = [];

          // For every chat room get the conversation
          chatRooms.forEach(async (chatRoom) => {
            onValue(
              dbRef(realtime, `messages/${chatRoom}`),
              async (snapshot) => {
                const beta = snapshot.val();
                // Sort the conversations by time stamp - newest to oldest
                const sorted = Object.keys(beta).sort((a, b) => {
                  return beta[b].timeStamp - beta[a].timeStamp;
                });

                // Get the object of the sorted conversation
                const conversation = beta[sorted[0]];
                const { uid1, uid2 } = Firebase.Messages.deconstructSharedUID(
                  conversation.chatRoomId
                );

                // Get the other user
                var textingUID;
                if (uid1 === User.uid) {
                  textingUID = uid2;
                } else {
                  textingUID = uid1;
                }

                // Get data for the user with textingUID
                const docRef = doc(db, "users", textingUID);
                const docSnap = await getDoc(docRef);
                const talkingTo = docSnap.data();

                const newConversation = {
                  id: conversation.chatRoomId,
                  name: talkingTo.name,
                  message: conversation.message,
                  time: Functions.timeParse(conversation.timeStamp),
                  profilePhotoURL: talkingTo.profilePhotoUrl,
                  talkingTo: talkingTo,
                  key: Object.keys(beta).find((key) => {
                    return beta[key].chatRoomId.includes(User.uid);
                  }),
                };
                newData.push(newConversation);
                if (newData.length === chatRooms.length) {
                  // Sort conversations by the latest message for each chat room
                  const sortedConversations = newData.sort((a, b) => {
                    return b.timeStamp - a.timeStamp;
                  });

                  // Set data state with the sorted conversations
                  setData(sortedConversations);
                }
              }
            );
          });
        });
      };

      getData();
    } catch (error) {
      console.log("Error @Chat.jsx: ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Chats navigation={navigation} data={data} />
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

// const data = [
//   {
//     id: 1,
//     name: "John Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 2,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 3,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 4,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 5,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 6,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 7,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 8,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 9,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 10,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
//   {
//     id: 11,
//     name: "Jane Doe",
//     message: "Hello there, how are you?",
//     time: "4:20 PM",
//     unread: 2,
//     profilePhotoURL: "https://picsum.photos/200",
//   },
// ];
