import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Settings</Text>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
