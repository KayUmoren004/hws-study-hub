import { NavigationContainer } from "@react-navigation/native";
import React from "react";

// Dependencies
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loading from "./shared/src/components/auth/Loading";

import { UserProvider } from "./shared/src/helpers/UserContext";
import { FirebaseProvider } from "./shared/src/helpers/FirebaseContext";

const App = () => {
  return (
    <SafeAreaProvider>
      <FirebaseProvider>
        <UserProvider>
          <NavigationContainer>
            <Loading />
          </NavigationContainer>
        </UserProvider>
      </FirebaseProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
