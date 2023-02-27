import { Feather } from "@expo/vector-icons";
import React from "react";

// Dependencies
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ title, right, left, close, search }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={close}>
        <Feather name={left} size={25} color="red" style={{}} />
      </TouchableOpacity>
      <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>
        {title}
      </Text>
      <TouchableOpacity onPress={search}>
        <Feather name={right} size={25} color="#fff" style={{}} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 10,
  },
});
