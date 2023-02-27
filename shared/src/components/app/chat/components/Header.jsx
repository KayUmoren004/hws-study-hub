import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Colors from "../../../../utils/Colors";

const Header = ({ navigation, person }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        flexDirection: "row",

        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        // marginVertical: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        {/* Back */}
        <TouchableOpacity
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 10,
            marginRight: 20,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={40} color="#fff" />
        </TouchableOpacity>
        {/* Photo & Title */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Person")}
        >
          {/* Profile Photo */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Image
              source={require("../../../../../assets/icon.png")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              {person.name}
            </Text>
            <Text
              style={{ color: Colors.bottleGreen, fontSize: 12, marginTop: 5 }}
            >
              Online
            </Text>
          </View>
        </TouchableOpacity>
        {/* Options */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => console.log("Phone Call")}>
              <Feather
                style={{ marginRight: 20 }}
                name="phone"
                size={25}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Video Call")}>
              <Feather
                style={{ marginRight: 20 }}
                name="video"
                size={25}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
