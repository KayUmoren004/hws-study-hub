import { Text, Image, View } from "react-native";

import Colors, { DarkColors, LightColors } from "../../../utils/Colors";
import { useEffect } from "react";

const FakeImage = ({ name, width, height, borderRadius }) => {
  const Letter = name.charAt(0).toUpperCase();

  let bg, tc;

  // Randomize background color and text color on load
  switch (Math.floor(Math.random() * 10)) {
    case 0:
      bg = Colors.oxfordBlue;
      tc = Colors.white;
      break;
    case 1:
      bg = Colors.darkByzantium;
      tc = Colors.white;
      break;
    case 2:
      bg = Colors.cadet;
      tc = Colors.white;
      break;
    case 3:
      bg = Colors.spanishBistre;
      tc = Colors.white;
      break;
    case 4:
      bg = Colors.hookersGreen;
      tc = Colors.white;
      break;
    case 5:
      bg = Colors.languidLavender;
      tc = Colors.white;
      break;
    default:
      bg = Colors.oxfordBlue;
      tc = Colors.white;
      break;
  }

  // Convert the value of the Colors object to an array
  const Light = LightColors;
  const Dark = DarkColors;

  // Set background to a random color from the Light array
  const randomLight = Math.floor(Math.random() * Light.length);
  bg = Light[randomLight];

  // Set text color to a random color from the Dark array
  const randomDark = Math.floor(Math.random() * Dark.length);
  tc = Dark[randomDark];

  return (
    <View
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: tc,
          fontSize: (width + 50) / 2,
          fontWeight: "bold",
          textAlign: "center",
          textAlignVertical: "center",
        }}
      >
        {Letter}
      </Text>
    </View>
  );
};

export default FakeImage;
