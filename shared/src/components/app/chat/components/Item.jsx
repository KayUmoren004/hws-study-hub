import React from "react";

// Dependencies
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "../../../../utils/Colors";

const Item = ({ navigation, data }) => {
  // State
  const [pressed, setPressed] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Messages", { id: data.id })}
      style={[
        styles.container,
        {
          backgroundColor: pressed ? "#ffffff45" : Colors.black,
        },
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* PROFILE PHOTO */}
      <View
        style={{
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../../../../../assets/icon.png")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
          resizeMode="contain"
        />
      </View>
      {/* NAME, MESSAGE AND UNREAD */}
      <View
        style={{
          flex: 1,
        }}
      >
        {/* NAME AND UNREAD */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* NAME */}
          <View>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {data.name}
            </Text>
          </View>
          {/* UNREAD */}
          <View
            style={{
              backgroundColor: Colors.darkByzantium,
              borderRadius: 50,
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              {data.unread}
            </Text>
          </View>
        </View>
        {/* MESSAGE AND TIME */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* MESSAGE */}
          <View>
            <Text
              style={{
                color: "#fff",
                // TODO: Change opacity based on if the message is read or not
                opacity: 0.5,
              }}
            >
              {data.message}
            </Text>
          </View>
          {/* TIME */}
          <View>
            <Text
              style={{
                color: "#fff",
                opacity: 0.5,
              }}
            >
              {data.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    padding: 15,
  },
});
