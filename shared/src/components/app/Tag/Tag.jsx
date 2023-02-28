import { Feather } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../utils/Colors";
import { UserContext } from "../../../helpers/UserContext";
import { FirebaseContext } from "../../../helpers/FirebaseContext";

const Tag = ({ tag }) => {
  const [isTagSelected, setIsTagSelected] = React.useState(false);

  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  const backgroundColor = isTagSelected ? Colors.bottleGreen : Colors.black;

  const opacity = isTagSelected ? 1 : 0;
  const fontWeight = isTagSelected ? "bold" : "normal";

  return (
    <View style={{ padding: 5 }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor }]}
        onPress={() => {}}
        onPressOut={async () => {}}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight,
          }}
        >
          {tag}
        </Text>
        <Feather
          name="check-circle"
          color={Colors.white}
          size={20}
          style={{
            opacity,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
