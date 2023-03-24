import React, { useState } from "react";
import { TouchableOpacity, Text, View, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const Attachment = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePicker = async (option) => {
    setModalVisible(false);
    let result;

    switch (option) {
      case "file":
        result = await ImagePicker.launchImageLibraryAsync();
        break;
      case "library":
        result = await ImagePicker.launchImageLibraryAsync();
        break;
      case "camera":
        result = await ImagePicker.launchCameraAsync();
        break;
      default:
        return;
    }

    if (!result.cancelled) {
      // Do something with the image file
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: "#f4511e",
          borderRadius: 10,
          padding: 10,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="camera-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              width: "90%",
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={() => handleImagePicker("file")}
            >
              <Text style={{ fontSize: 18 }}>Upload from File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={() => handleImagePicker("library")}
            >
              <Text style={{ fontSize: 18 }}>Choose from Photo Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={() => handleImagePicker("camera")}
            >
              <Text style={{ fontSize: 18 }}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#f4511e",
              borderRadius: 10,
              padding: 10,
              position: "absolute",
              bottom: 20,
            }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default Attachment;
