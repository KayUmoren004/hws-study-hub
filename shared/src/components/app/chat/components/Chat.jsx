import { Feather, Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useLayoutEffect,
} from "react";

import * as ImagePicker from "expo-image-picker";

// Dependencies
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // SafeAreaView,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Actions,
  Send,
  Message,
  MessageImage,
  Time,
  Bubble,
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

import * as DocumentPicker from "expo-document-picker";

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

import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";

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

        // console.log("Chat.jsx.lastMessage: ", lastMessage);

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
      header: () => (
        <Header
          navigation={navigation}
          person={person}
          faceTime={facetime}
          phoneNumber={callPhoneNumber}
          num={person.phoneNumber}
        />
      ),
    });
  }, [navigation, person, facetime, callPhoneNumber]);

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

  // Send Message - Files and Text
  // const onSend = useCallback((messages = []) => {
  //   // Custom message object

  //   // console.log("Messages: ", messages);

  //   const newMessages = messages.map((message) => ({
  //     ...message,
  //     message: message.text,
  //     user: getUser(),
  //     chatRoomId: returnUID(),
  //     read: false,
  //     type: message.fileInfo.type ? message.fileInfo.type : "text",
  //     fileUri: message.fileInfo.fileUri ? message.fileInfo.fileUri : null,
  //     fileName: message.fileInfo.fileName ? message.fileInfo.fileName : null,
  //     fileType: message.fileInfo.fileType ? message.fileInfo.fileType : null,
  //     fileHeight: message.fileInfo.fileHeight
  //       ? message.fileInfo.fileHeight
  //       : null,
  //     fileWidth: message.fileInfo.fileWidth ? message.fileInfo.fileWidth : null,
  //   }));

  //   // console.log("New Message: ", newMessages);
  //   Firebase.Messages.sendMessage(newMessages);
  //   // console.log("Message has called Firebase: ", newMessages);
  // }, []);

  const onSend = useCallback((messages = []) => {
    // Custom message object

    const newMessages = messages.map((message) => {
      const hasFileInfo = message.fileInfo !== undefined;

      return {
        ...message,
        message: message.text,
        user: getUser(),
        chatRoomId: returnUID(),
        read: false,
        type:
          hasFileInfo && message.fileInfo.type ? message.fileInfo.type : "text",
        fileUrl:
          hasFileInfo && message.fileInfo.fileUrl
            ? message.fileInfo.fileUrl
            : null,
        fileName:
          hasFileInfo && message.fileInfo.fileName
            ? message.fileInfo.fileName
            : null,
        fileType:
          hasFileInfo && message.fileInfo.fileType
            ? message.fileInfo.fileType
            : null,
        fileHeight:
          hasFileInfo && message.fileInfo.fileHeight
            ? message.fileInfo.fileHeight
            : null,
        fileWidth:
          hasFileInfo && message.fileInfo.fileWidth
            ? message.fileInfo.fileWidth
            : null,
      };
    });

    Firebase.Messages.sendMessage(newMessages);
  }, []);

  // Handle Send
  const handleSend = async (messages) => {
    if (!messages || messages.length === 0) return;

    // console.log("Content: ", messages);

    const content = messages[0].text;

    if (typeof content === "string") {
      onSend([{ text: content }], "text");
    } else if (content instanceof File || content instanceof Blob) {
      //  const file = await pickDocument();
      console.log("File: ", content);
    } else {
      console.log("Error: ", content);
    }
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

  // FaceTime
  function facetime(phoneNumber) {
    const url =
      Platform.OS === "ios" ? `facetime:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.openURL(url);
  }

  // Call Phone Number
  function callPhoneNumber(phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  // Send Document
  const isAllowedFileType = (uri) => {
    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "rtf",
    ];
    const fileExtension = uri.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });

      if (result.type !== "cancel") {
        const fileSizeInMB = result.size / (1024 * 1024);
        const allowed = isAllowedFileType(result.uri);
        if (
          fileSizeInMB <= 10 &&
          allowed === true &&
          result.uri !== null &&
          result.uri !== undefined
        ) {
          const fileExtension = result.uri.split(".").pop().toLowerCase();
          const fileName = result.name.split(".").slice(0, -1).join(".");

          const file = {
            uri: result.uri,
            name: fileName,
            type: fileExtension,
          };
          return file;
        } else {
          console.log(
            "Invalid file selection. Ensure the file is less than 10MB and a common document type."
          );
        }
      } else {
        console.log("File picking was cancelled");
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
    return null;
  };

  // Send Image
  async function requestPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === "granted") {
      return true;
    } else {
      return false;
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    if (!result.canceled) {
      return result;
    } else {
      return null;
    }
  }

  async function manipulateImage(asset, aspectRatio) {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      asset.assets[0].uri,
      [{ resize: { width: aspectRatio.width, height: aspectRatio.height } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return manipulatedImage;
  }

  async function handleButtonClick() {
    const hasPermissions = await requestPermissions();

    if (!hasPermissions) {
      console.log("Permissions not granted");
      return;
    }

    const selectedAsset = await pickImage();

    if (selectedAsset) {
      const aspectRatio = {
        width: selectedAsset.assets[0].width,
        height: selectedAsset.assets[0].height,

        // width: 9,
        // height: 16,
      };
      const name = selectedAsset.assets[0].fileName;

      const manipulatedImage = await manipulateImage(
        selectedAsset,
        aspectRatio
      );

      // Do something with the manipulated image
      // console.log("Manipulated image:", manipulatedImage);

      const file = {
        uri: manipulatedImage.uri,
        name: name ? name : "Attachment: Image",
        type: "image",
        height: aspectRatio.height,
        width: aspectRatio.width,
      };

      // console.log("File: ", file);

      return file;
    } else {
      console.log("No image was picked");
    }
  }

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}

      {/* Body */}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={getUser()}
        renderMessage={(props) => {
          // Destructure props
          const { currentMessage } = props;

          const text = currentMessage.text.type
            ? `File: ${currentMessage.text.fileName}`
            : currentMessage.text;

          const url = currentMessage.text.fileUrl;

          const type = currentMessage.text.type;

          // console.log("Text - Chat.jsx: ", text);

          // Edit props to change currentMessage.text to the text passed into this component
          const newProps = {
            ...props,
            currentMessage: {
              ...props.currentMessage,
              text: text,
              type:
                currentMessage.text.type && currentMessage.text.type !== "image"
                  ? "file"
                  : null,
            },
          };
          const imageProps = {
            ...props,
            currentMessage: {
              ...props.currentMessage,
              text: "",
              image: url,
            },
          };

          // Return message
          return type === "image" ? (
            <Message
              // renderBubble={(props) => {
              //   console.log("Props: ", props);
              //   return type === "image" ? (
              //     <Bubble
              //       {...imageProps}
              //       // containerStyle={{
              //       //   left: {
              //       //     backgroundColor: "#000",
              //       //   },
              //       //   right: {
              //       //     backgroundColor: "#000",
              //       //   },
              //       // }}
              //       bottomContainerStyle={{
              //         left: {
              //           backgroundColor: "#000",
              //         },
              //         right: {
              //           backgroundColor: "#000",
              //         },
              //       }}
              //       wrapperStyle={{
              //         left: {
              //           backgroundColor: "#000",
              //         },
              //         right: {
              //           backgroundColor: "#000",
              //         },
              //       }}
              //       containerStyle={{
              //         left: {
              //           backgroundColor: "#000",
              //         },
              //         right: {
              //           backgroundColor: "#000",
              //         },
              //       }}
              //     />
              //   ) : (
              //     <Bubble {...imageProps} />
              //   );
              // }}
              {...imageProps}
            />
          ) : (
            <CustomMessage
              text={text}
              url={url}
              type={currentMessage.text.type}
              {...newProps}
            />
          );
        }}
        showAvatarForEveryMessage={true}
        wrapInSafeArea={false}
        placeholder="Message..."
        renderAvatarOnTop={true}
        renderFooter={() => <View style={{ height: 10 }} />}
        isTyping={true}
        renderActions={(props) => (
          <Actions
            {...props}
            options={{
              ["Send Image"]: async () => {
                console.log("Send Image - Before handleButtonClick");
                const File = await handleButtonClick();
                console.log("Send Image - After handleButtonClick", File);
                onSend([
                  {
                    text: `Image attached: ${File.name}`,
                    fileInfo: {
                      type: "image",
                      fileUrl: File.uri,
                      fileName: File.name,
                      fileType: File.type,
                      fileHeight: File.height,
                      fileWidth: File.width,
                    },
                  },
                ]);
                console.log("Send Image - After onSend");
              },

              ["Send Files"]: async () => {
                const file = await pickDocument();
                onSend([
                  {
                    text: `File attached: ${file.name}`,
                    fileInfo: {
                      type: "file",
                      fileUrl: file.uri,
                      fileName: file.name,
                      fileType: file.type,
                    },
                  },
                ]);
              },
              ["Cancel"]: () => {},
            }}
            icon={() => (
              <Feather name="paperclip" size={20} color={Colors.white} />
            )}
          />
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
              marginTop: 6,
              marginHorizontal: 6,
              borderTopColor: Colors.lightGray,
            }}
          />
        )}
        textInputProps={{
          color: "#fff",
        }}
        renderMessageImage={(props) => {
          return (
            <MessageImage
              {...props}
              imageStyle={{
                width: Dimensions.get("window").width * 0.6,
                height: Dimensions.get("window").width,
                resizeMode: "center",
              }}
              containerStyle={{
                backgroundColor: "#000",
              }}
            />
          );
        }}
        renderBubble={(props) => {
          const { currentMessage } = props;

          const type = currentMessage.image ? "image" : "text";
          return type === "image" ? (
            <Bubble
              {...props}
              bottomContainerStyle={{
                left: {
                  backgroundColor: "#000",
                },
                right: {
                  backgroundColor: "#000",
                },
              }}
            />
          ) : (
            <Bubble {...props} />
          );
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
