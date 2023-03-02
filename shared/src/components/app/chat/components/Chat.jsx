import { Feather, Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import React, { useEffect, useState, useCallback, useContext } from "react";

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

const Chat = ({ id, navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();

  // Params
  const { person } = route.params;

  // Context
  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // console.log(whereFrom);

  // TODO: Get user you are texting

  // use effect to change the header
  useEffect(() => {
    navigation.setOptions({
      header: () => <Header navigation={navigation} person={person} />,
    });
  }, [navigation]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Ladies and gentlemen",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tyler",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Ladies and gentlemen",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tyler",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 3,
        text: "Ladies and gentlemen",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tyler",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 4,
        text: "Ladies and gentlemen",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tyler",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 5,
        text: "Ladies and gentlemen",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Tyler",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
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
      profilePhoto: User.profilePhoto,
    };
  };

  // Get Messages and listen for new messages
  useEffect(() => {
    try {
      Firebase.Messages.getMessages((message) =>
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, message)
        )
      );
    } catch (error) {
      console.log("Error getting messages: ", error);
    }
  }, []);

  // When screen is no longer in view call listener

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}

      {/* Body */}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={getUser()}
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
              // borderColor: Colors.gray,
              // alignContent: "center",
              // justifyContent: "center",
              // borderTopWidth: 2,
              // borderBottomWidth: 2,
              // borderRightWidth: 2,
              // borderLeftWidth: 2,
              paddingTop: 6,
              marginHorizontal: 6,
              // borderRadius: 32,
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
