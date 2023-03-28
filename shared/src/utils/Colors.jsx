const Colors = {
  oxfordBlue: "#091540ff", // Background color / Primary color
  darkByzantium: "#673c5cff",
  cadet: "#5e747fff", // Secondary color
  spanishBistre: "#857a47ff",
  hookersGreen: "#5a716aff",
  black: "#000000ff",
  white: "#ffffffff",
  gray: "#808080ff",
  lightGray: "#e0e0e0ff",
  darkGray: "#404040ff",
  lavenderBlue: "#b8c5f5ff",
  languidLavender: "#e8d8e4ff",
  lavenderWeb: "#d9d8e8ff",
  eggshell: "#eae6d7ff",
  ashGray: "#bbc9c4ff",
  orange: "#F26724",
  bottleGreen: "#006957",
  violet: "#442463",
  lavenderWeb: "#d7dae5",
  yellow: "#f2c94cff",
};

// Light Colors from Colors object
export const LightColors = [
  Colors.yellow,
  Colors.lavenderWeb,
  Colors.ashGray,
  Colors.eggshell,
  Colors.languidWeb,
  Colors.languidLavender,
  Colors.lavenderBlue,
  Colors.lightGray,
  Colors.white,
];

// Dark Colors from Colors object - This should be all the remaining colors that are not in LightColors
export const DarkColors = [
  Colors.oxfordBlue,
  Colors.darkByzantium,
  Colors.cadet,
  Colors.spanishBistre,
  Colors.hookersGreen,
  Colors.black,
  Colors.gray,
  Colors.darkGray,
  Colors.violet,
];

export default Colors;
