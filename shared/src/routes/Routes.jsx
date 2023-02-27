import React, { useContext } from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";
import { UserContext } from "../helpers/UserContext";

// TF
import TF from "../../../tfs/routes/Routes";

// Student
import Student from "../../../students/routes/Routes";

import useOnlinePresence from "../helpers/hooks/useOnlinePresence";

const Routes = () => {
  const [User] = useContext(UserContext);

  // Hooks
  useOnlinePresence();

  return User.isTF ? <TF /> : <Student />;
};

export default Routes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
