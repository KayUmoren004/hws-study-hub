import React, { useState } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Delimitated from "./Tag/Delimitated";

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
        <Image
          source={{ uri: TFs.profilePhotoUrl }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
          }}
          resizeMode="contain"
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
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {/* Tags */}

          <ScrollView horizontal={true}>
            {TFs.tags.map((tag, index) => {
              return <Delimitated key={index} tag={tag} />;
            })}
          </ScrollView>
        </View>
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
