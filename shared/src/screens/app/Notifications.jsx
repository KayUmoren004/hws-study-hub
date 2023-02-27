Notifications;
import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Notifications</Text>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
