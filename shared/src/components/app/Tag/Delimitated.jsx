import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../utils/Colors";

const Delimitated = ({ tag }) => {
  return (
    <View style={{ padding: 5 }}>
      <View style={styles.container}>
        <Text
          style={{
            color: "#fff",
            textAlign: "Justify",
            fontWeight: "bold",
          }}
        >
          {tag}
        </Text>
      </View>
    </View>
  );
};

export default Delimitated;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.bottleGreen,
  },
});
