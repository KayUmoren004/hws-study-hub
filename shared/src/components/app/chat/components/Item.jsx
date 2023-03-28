import React, { useCallback, useContext, useEffect, useState } from "react";

// Dependencies
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "../../../../utils/Colors";
import { useFocusEffect } from "@react-navigation/native";

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

import CachedImage from "expo-cached-image";
import FakeImage from "../../profile/FakeImage";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

const Item = ({ navigation, data }) => {
  // State
  const [pressed, setPressed] = React.useState(false);
  const [unread, setUnread] = React.useState([]);

  // Context
  const [User] = useContext(UserContext);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [counter, setCounter] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const getUnreadMessageKey = async () => {
        const unreadRef = dbRef(realtime, `users/${User.uid}`);
        const unreadKeys = [];
        const unreadMessageIDs = [];

        // Get Every document key and push it to unreadKeys array. Check if the snapshot exists
        onValue(unreadRef, (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const key = childSnapshot.key;
              unreadKeys.push(key);
            });
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
            }
          });
        });

        // console.log("unreadMessageIDs: ", unreadMessageIDs);

        // Create an array of objects with the key and messageID
        const unreadMessages = [];
        unreadKeys.forEach((key, index) => {
          unreadMessageIDs.forEach((id) => {
            unreadMessages.push({ key: key, messageID: id });
          });
        });

        return unreadMessages;
      };

      // Get Unread Messages
      const getUnreadMessages = async () => {
        try {
          const unreadObject = await getUnreadMessageKey();
          // console.log("unreadObject: ", unreadObject);

          unreadObject.forEach((object) => {
            // console.log("object: ", object);
            const messageRef = dbRef(
              realtime,
              `messages/${object.key}/${object.messageID}`
            );

            onValue(messageRef, (snapshot) => {
              if (snapshot.exists()) {
                // console.log("snapshot: ", snapshot);
                const message = snapshot.val();
                setUnreadMessages((prev) => [...prev, message]);
              }
            });
          });
        } catch (err) {
          console.log("Error @Item.jsx.getUnreadMessages: ", err);
        }
      };

      getUnreadMessages();

      return () => {
        // Cleanup function to remove listeners
        unreadMessages.forEach((message) => {
          const messageRef = dbRef(
            realtime,
            `messages/${message.key}/${message.messageID}`
          );
          off(messageRef);
        });
      };
    }, [])
  );

  useEffect(() => {
    const unsubscribe = onValue(
      dbRef(realtime, `users/${User.uid}`),
      (snapshot) => {
        const data = snapshot.val();
        // console.log("Data: ", data);
        const d = [];
        for (const key in data) {
          if (data[key].unread) {
            const z = data[key].unread;
            for (const k in z) {
              if (z[k]) {
                d.push(z[k]);
              }
            }
          }
        }

        if (d.length > 0) {
          setCounter(d.length);
        } else {
          setUnread(0);
        }
      }
    );

    return unsubscribe;
  }, []);

  // console.log("Unread: ", unreadMessages);

  // console.log("Data: ", data.message.fileName);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Message", {
          id: data.id,
          person: data.talkingTo,
        });
        setCounter(0);
      }}
      style={[
        styles.container,
        {
          backgroundColor: pressed ? "#ffffff45" : Colors.black,
        },
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* PROFILE PHOTO */}
      <View
        style={{
          marginRight: 10,
        }}
      >
        {/* <Image
          source={
            data.profilePhotoURL === "default"
              ? require("../../../../../../assets/icon.png")
              : { uri: data.profilePhotoURL }
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
          resizeMode="contain"
        /> */}

        <CachedImage
          source={{
            uri: `${data.profilePhotoURL}`, // (required) -- URI of the image to be cached
            // headers: `Authorization: Bearer ${token}`, // (optional)
            expiresIn: 2_628_288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
          }}
          cacheKey={`${data.uid}-thumb`} // (required) -- key to store image locally
          placeholderContent={
            // (optional) -- shows while the image is loading
            <FakeImage
              width={50}
              height={50}
              borderRadius={50}
              name={data.name}
            />
          }
          resizeMode="contain" // pass-through to <Image /> tag
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
      </View>
      {/* NAME, MESSAGE AND UNREAD */}
      <View
        style={{
          flex: 1,
        }}
      >
        {/* NAME AND UNREAD */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* NAME */}
          <View>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {data.name}
            </Text>
          </View>
          {/* UNREAD */}
          {counter > 0 && (
            <View
              style={{
                backgroundColor: Colors.darkByzantium,
                borderRadius: 50,
                width: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                {counter}
              </Text>
            </View>
          )}
        </View>
        {/* MESSAGE AND TIME */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* MESSAGE */}
          <View>
            {
              // Change opacity if the message is unread
              unreadMessages.some((message) => message.id === data.id) ? (
                <Text
                  style={{
                    color: "#fff",
                    opacity: 0.5,
                  }}
                  numberOfLines={1}
                >
                  {typeof data.message === "object"
                    ? "Sent an Attachment"
                    : data.message}
                </Text>
              ) : (
                <Text
                  style={{
                    color: "#fff",
                  }}
                  numberOfLines={1}
                >
                  {typeof data.message === "object"
                    ? "Sent an Attachment"
                    : data.message}
                </Text>
              )
            }
          </View>
          {/* TIME */}
          <View>
            <Text
              style={{
                color: "#fff",
                opacity: 0.5,
              }}
            >
              {data.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    padding: 15,
  },
});
