import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";

const Search = ({ tags }) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Search</Text>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
