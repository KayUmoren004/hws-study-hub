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

const TFView = ({ TFs, navigation }) => {
  return (
    <View
      onPress={() => navigation.navigate("Person", { person: TFs })}
      style={styles.container}
    >
      {/* Left */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Person", { person: TFs })}
      >
        {/* Profile Picture */}
        {/* <Image
          source={{ uri: TFs.profilePhotoUrl }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
          }}
          resizeMode="contain"
        /> */}
        <CachedImage
          source={{
            uri: `${TFs.profilePhotoUrl}`, // (required) -- URI of the image to be cached
            // headers: `Authorization: Bearer ${token}`, // (optional)
            expiresIn: 2_628_288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
          }}
          cacheKey={`${TFs.uid}-thumb`} // (required) -- key to store image locally
          placeholderContent={
            // (optional) -- shows while the image is loading
            <FakeImage
              width={90}
              height={90}
              borderRadius={50}
              name={TFs.name}
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
          onPress={() => navigation.navigate("Person", { person: TFs })}
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
            {TFs.name}
          </Text>
        </TouchableOpacity>
        {/* Bottom */}

        {/* Tags */}

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              paddingRight: 100,
            }}
          >
            {TFs.tags.map((tag, index) => {
              return <Delimitated key={index} tag={tag} />;
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TFView;

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
