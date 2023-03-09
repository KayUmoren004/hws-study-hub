import { Feather, Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useLayoutEffect,
} from "react";

// Dependencies
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // SafeAreaView,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Actions,
  Send,
} from "react-native-gifted-chat";
import Colors from "../../../../utils/Colors";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import Header from "./Header";
import { UserContext } from "../../../../helpers/UserContext";
import { FirebaseContext } from "../../../../helpers/FirebaseContext";
import { useIsFocused } from "@react-navigation/native";

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

// Render
import { CustomMessage } from "./Renders";

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();

  // Params
  const { person, id, data } = route.params;

  // Context
  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  useEffect(() => {
    const messageRef = dbRef(realtime, `messages/${returnUID()}`);
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Get keys of documents
        const keys = Object.keys(data);
        // Get values of documents
        const values = Object.values(data);
        // Get the last message and match it with the last key
        const lastMessage = values[values.length - 1];
        const lastKey = keys[keys.length - 1];

        console.log("Chat.jsx.lastMessage: ", lastMessage);

        // Set the last message as read
        const messageRef = dbRef(
          realtime,
          `messages/${returnUID()}/${lastKey}`
        );
        update(messageRef, { read: true });

        // Remove the last message from the "unread" array
        const unreadRef = dbRef(
          realtime,
          `users/${User.uid}/${lastMessage.chatRoomId}`
        );
        remove(unreadRef);
      }
    });

    return unsubscribe;
  }, []);

  // If the screen is focused, set all messages to read
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      // readMessage();
      //  console.log("Chat.jsx.readUnreadMessages: ", 1);

      const unreadRef = dbRef(realtime, `users/${User.uid}`);
      const unreadMessages = [];

      // Get every unread message key and ID
      const unreadSnapshot = await get(unreadRef);
      if (unreadSnapshot.exists()) {
        unreadSnapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          //  console.log("Chat.jsx.key: ", key);

          const ur = childSnapshot.child("unread").val() || [];
          ur.forEach((id) => {
            unreadMessages.push({ key, messageID: id });
          });
        });
      }

      //  console.log("Chat.jsx.unreadMessages: ", unreadMessages);

      // Set all messages as read and remove them from the "unread" array
      await Promise.all(
        unreadMessages.map(({ key, messageID }) => {
          const messageRef = dbRef(realtime, `messages/${key}/${messageID}`);
          const unreadRef = dbRef(realtime, `users/${User.uid}/${key}`);

          return Promise.all([
            update(messageRef, { read: true }),
            remove(unreadRef),
          ]);
        })
      );

      //  console.log("Chat.jsx.readUnreadMessages: Completed");
    });

    return unsubscribe;
  }, [navigation]);

  // use effect to change the header
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header navigation={navigation} person={person} />,
    });
  }, [navigation]);

  // Use the right UID
  const returnUID = () => {
    return data != undefined ? data.sharedUID : id;
  };

  // Read unread messages
  useEffect(() => {
    const getUnreadMessageKey = async () => {
      //  console.log("Chat.jsx.getUnreadMessageKey: ", 1);
      const unreadRef = dbRef(realtime, `users/${User.uid}`);
      const unreadKeys = [];
      const unreadMessageIDs = [];

      // Get Every document key and push it to unreadKeys array. Check if the snapshot exists
      onValue(unreadRef, (snapshot) => {
        //  console.log("Chat.jsx.snapshot: ", snapshot);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            //  console.log("Chat.jsx.key: ", key);
            unreadKeys.push(key);
          });
        } else {
          //  console.log("Chat.jsx.snapshot: ", snapshot);
        }
      });

      // Get Every unread message ID and push it to unreadMessageIDs array. Check if the snapshot exists
      unreadKeys.forEach((key) => {
        const unreadMessageRef = dbRef(realtime, `users/${User.uid}/${key}`);
        onValue(unreadMessageRef, (snapshot) => {
          if (snapshot.exists()) {
            const ur = snapshot.child("unread").val();
            ur.forEach((id) => {
              unreadMessageIDs.push(id);
            });
          } else {
            //  console.log("Snapshot does not exist: ", snapshot);
          }
        });
      });

      //  console.log("Chat.jsx.unreadMessageIDs: ", unreadMessageIDs);

      // Create an array of objects with the key and messageID
      const unreadMessages = [];
      unreadKeys.forEach((key, index) => {
        unreadMessageIDs.forEach((id) => {
          unreadMessages.push({ key: key, messageID: id });
        });
      });

      return unreadMessages;
    };

    const readMessage = async () => {
      const unreadObject = await getUnreadMessageKey();
      //  console.log("Unread Object: ", unreadObject);
      unreadObject.forEach((object) => {
        //  console.log("Chat.jsx.object :", object);

        const messageID = object.messageID;
        const key = object.key;

        const messageRef = dbRef(realtime, `messages/${key}/${messageID}`);

        // Set the message as read
        update(messageRef, {
          read: true,
        });
        //  console.log("Updated Completed");

        // Delete the message from the "unread" array
        const unreadRef = dbRef(realtime, `users/${User.uid}/${key}`);
        remove(unreadRef);
        //  console.log("Removed Completed");
      });
    };

    readMessage();
  }, []);

  // Send Message
  const onSend = useCallback((messages = []) => {
    // Custom message object
    const newMessages = messages.map((message) => ({
      ...message,
      message: message.text,
      user: getUser(),
      chatRoomId: returnUID(),
      read: false,
    }));

    Firebase.Messages.sendMessage(newMessages);
  }, []);

  const Left = () => {
    return (
      <TouchableOpacity style={{}} onPress={() => console.log("Attachment")}>
        <Feather name="paperclip" size={20} color={Colors.white} />
      </TouchableOpacity>
    );
  };

  // Get User
  const getUser = () => {
    return {
      _id: User.uid, // This should be from Firebase
      name: User.name,
      uid: User.uid,
      profilePhoto: User.profilePhotoUrl,
    };
  };

  // Get Messages and listen for new messages
  useEffect(() => {
    try {
      Firebase.Messages.getMessages(
        (message) =>
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, message)
          ),
        returnUID()
      );
    } catch (error) {
      console.log("Error getting messages: ", error);
    }
  }, []);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}

      {/* Body */}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={getUser()}
        renderMessage={(props) => <CustomMessage {...props} />}
        // renderUsernameOnMessage={true}
        showAvatarForEveryMessage={true}
        wrapInSafeArea={false}
        placeholder="Message..."
        renderAvatarOnTop={true}
        renderFooter={() => <View style={{ height: 10 }} />}
        isTyping={true}
        // alwaysShowSend={true}
        renderActions={(props) => (
          <Actions {...props} icon={() => <Left />} options={{}} />
        )}
        bottomOffset={insets.bottom}
        renderSend={(props) => (
          <Send
            {...props}
            label="Send"
            containerStyle={{
              height: 44,
              justifyContent: "center",
              alignContent: "center",
              borderWidth: 0,
              paddingTop: 6,
              marginHorizontal: 6,
              // borderRadius: 32,
              opacity: 1,
              borderColor: Colors.gray,
              backgroundColor: "transparent",
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "transparent",
              paddingTop: 6,
              marginHorizontal: 6,
              borderTopColor: Colors.lightGray,
            }}
          />
        )}
        textInputProps={{
          color: "#fff",
        }}
      />
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
