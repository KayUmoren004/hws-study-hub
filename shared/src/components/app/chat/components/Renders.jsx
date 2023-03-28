import React, { useState } from "react";

import {
  Linking,
  Text,
  View,
  Button,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Message, Bubble } from "react-native-gifted-chat";

import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import WebView from "react-native-webview";
import { Feather } from "@expo/vector-icons";

// Message
// const CustomMessage = ({ text, url, type, ...props }) => {
//   const [isModalVisible, setIsModalVisible] = React.useState(false);

//   // const handlePress = () => {
//   //   if (typeof url === "string") {
//   //     Linking.openURL(url);
//   //   } else {
//   //     console.log("No URL");
//   //   }
//   // };

//   const handlePress = () => {
//     if (type === "file") {
//       setIsModalVisible(true);
//     } else if (typeof url === "string") {
//       Linking.openURL(url);
//     } else {
//       console.log("No URL");
//     }
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//   };

//   // return (
//   //   <Message onPress={handlePress} {...props}>
//   //     <Text>{text}</Text>
//   //   </Message>
//   // );

//   return (
//     <Message onPress={handlePress} {...props}>
//       <Modal visible={true}>
//         <DocumentViewer uri={url} onClose={closeModal} />
//       </Modal>
//     </Message>
//   );
// };

const CustomMessage = ({ text, url, type, ...props }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handlePress = () => {
    if (type === "file") {
      setIsModalVisible(true);
    } else if (typeof url === "string") {
      Linking.openURL(url);
    } else {
      console.log("No URL");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Message onPress={handlePress} {...props}>
        <Text>{text}</Text>
      </Message>
      {isModalVisible && (
        <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
          <DocumentViewer uri={url} onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};

// Document Viewer
const DocumentViewer = ({ uri, onClose }) => {
  const openInBrowser = async (url) => {
    await Linking.openURL(url);
  };

  const renderDocument = () => {
    const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      uri
    )}`;
    return (
      <View style={styles.container}>
        <WebView source={{ uri: googleDocsUrl }} style={styles.document} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingTop: 10,
            backgroundColor: "#000000",
          }}
        >
          <Button onPress={() => openInBrowser(uri)} title="Open in Browser" />
          <Button onPress={onClose} title="Close" color="red" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {uri ? (
        renderDocument()
      ) : (
        <View style={styles.errorContainer}>
          <Text>No URL provided</Text>
          <Button onPress={onClose} title="Close" />
        </View>
      )}
    </SafeAreaView>
  );
};

// Document Preview
// const DocumentPreview = ({ uri, type, text, ...props }) => {
//   const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
//     uri
//   )}`;

//   const openInBrowser = async (url) => {
//     await Linking.openURL(url);
//   };

//   const [clickedPreview, setClickedPreview] = useState(false);

//   return !clickedPreview ? (
//     <TouchableWithoutFeedback onPress={() => setClickedPreview(true)}>
//       <WebView
//         source={{ uri: googleDocsUrl }}
//         style={{
//           width: Dimensions.get("window").width * 0.6,
//           height: Dimensions.get("window").width,
//           resizeMode: "center",
//         }}
//       />
//     </TouchableWithoutFeedback>
//   ) : (
//     <Modal
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#000",
//       }}
//     >
//       <DocumentViewer uri={uri} onClose={() => setClickedPreview(false)} />
//     </Modal>
//   );
// };

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  document: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export { CustomMessage };
