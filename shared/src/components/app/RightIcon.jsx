import React from "react";

// Dependencies
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const RightIcon = ({ name, onPress, color, size }) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPress}
      >
        <Feather name={name} size={size} color={color} />
      </TouchableOpacity>
    </View>
  );
};

export default RightIcon;
