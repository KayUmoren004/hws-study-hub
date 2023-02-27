import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";
import { SearchBar } from "@rneui/themed";

const Bar = ({
  tags,
  setTags,
  containerStyle,
  inputStyle,
  leftIconContainerStyle,
  onChangeText,
}) => {
  const updateSearch = (search) => {
    setTags(search);
  };
  return (
    // <View style={styles.container}>
    //   <Text style={{ color: "#fff" }}>Bar</Text>
    // </View>
    <SearchBar
      placeholder="Search for Courses"
      onChangeText={updateSearch}
      value={tags}
      platform="ios"
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      leftIconContainerStyle={leftIconContainerStyle}
    />
  );
};

export default Bar;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    //marginVertical: 10,
  },
});
