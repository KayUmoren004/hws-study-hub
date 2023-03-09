import React from "react";

// Dependencies
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { Picker } from "@react-native-picker/picker";
import Colors from "../../../utils/Colors";

const RNPicker = ({ selectedValue, setPick, onClose, onBlur, data }) => {
  return (
    <View
      style={{
        width: "100%",
        height: "30%",
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
      >
        <Text style={styles.close}>Done</Text>
      </TouchableOpacity>
      <Picker
        style={{ width: "100%", height: 50 }}
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setPick(itemValue)}
        onBlur={onBlur}
      >
        {/* {isTags ? (
          tags.map((tag, idx) => (
            <Picker.Item key={idx} label={tag} value={tag} />
          ))
        ) : (
          <>
            <Picker.Item label="Open" value="Open" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="In Progress" value="In Progress" />
            <Picker.Item label="Completed" value="Completed" />
          </>
        )} */}
        {data.map((item, idx) => (
          <Picker.Item key={idx} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  close: {
    color: "#ff0000",
    marginTop: 10,
    fontSize: 20,
  },
});

export default RNPicker;
