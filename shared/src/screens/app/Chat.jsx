import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";
import Chats from "../../components/app/chat/Chats";

const Chat = ({ navigation }) => {
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

const data = [
  {
    id: 1,
    name: "John Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 2,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 3,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 4,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 5,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 6,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 7,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 8,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 9,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 10,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
  {
    id: 11,
    name: "Jane Doe",
    message: "Hello there, how are you?",
    time: "4:20 PM",
    unread: 2,
  },
];
