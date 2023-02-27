import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

const Button = ({ onPress, label, color, disabled }) => (
  <TouchableOpacity onPress={onPress} style={Styles.Btn} disabled={disabled}>
    <View
      style={[
        Styles.Btn,
        { backgroundColor: disabled ? Colors.gray : Colors.eggshell },
      ]}
    >
      <Text
        style={{ color: Colors.oxfordBlue, fontSize: 30, fontWeight: "200" }}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const Styles = StyleSheet.create({
  Btn: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
});

export default Button;
