import React, { useState } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Delimitated from "./Tag/Delimitated";

import CachedImage from "expo-cached-image";

import Colors from "../../utils/Colors";
import FakeImage from "./profile/FakeImage";

const StudentView = ({ Student, navigation, data }) => {
  return (
    <View
      onPress={() =>
        navigation.navigate("Person", { person: Student, data: data })
      }
      style={styles.container}
    >
      {/* Left */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Person", { person: Student, data: data })
        }
      >
        {/* Profile Picture */}
        {/* <Image
          source={{ uri: Student.profilePhotoUrl }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
          }}
          resizeMode="contain"
        /> */}
        <CachedImage
          source={{
            uri: `${Student.profilePhotoUrl}`, // (required) -- URI of the image to be cached
            // headers: `Authorization: Bearer ${token}`, // (optional)
            expiresIn: 2_628_288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
          }}
          cacheKey={`${Student.uid}-thumb`} // (required) -- key to store image locally
          placeholderContent={
            // (optional) -- shows while the image is loading
            <FakeImage
              width={90}
              height={90}
              borderRadius={50}
              name={Student.name}
            />
          }
          resizeMode="contain" // pass-through to <Image /> tag
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
          }}
        />
      </TouchableOpacity>
      {/* Right */}
      <View
        style={{
          padding: 10,
        }}
      >
        {/* Top */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Person", { person: Student, data: data })
          }
        >
          {/* Name */}
          <Text
            style={{
              color: "#fff",
              marginLeft: 5,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {Student.name}
          </Text>
        </TouchableOpacity>
        {/* Bottom */}
        {/* Tags */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginRight: 100,
            }}
          >
            {Student.tags.map((tag, index) => {
              return <Delimitated key={index} tag={tag} />;
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default StudentView;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    // justifyContent: "center",
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});
