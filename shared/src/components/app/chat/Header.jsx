import { Feather } from "@expo/vector-icons";
import React from "react";

// Dependencies
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../utils/Colors";

const Header = () => {
  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <TouchableOpacity style={{}} onPress={() => console.log("Search")}>
        <View
          style={{
            //  flex: 1,
            borderColor: Colors.eggshell,
            borderWidth: 2,
            borderRadius: 100,
            padding: 10,
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            // opacity: 0.8,
          }}
        >
          <Feather
            style={{
              color: Colors.lavenderBlue,
            }}
            name="search"
            size={24}
          />
        </View>
      </TouchableOpacity>
      {/* DIVIDER */}
      <View>
        <Text style={{ color: "#fff" }}>Divider</Text>
      </View>
      {/* COURSES */}
      <View>
        <Text style={{ color: "#fff" }}>Header</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    // justifyContent: "space-around",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: Colors.eggshell,
    borderTopColor: Colors.eggshell,
    paddingVertical: 10,
    marginTop: 5,
  },
});
