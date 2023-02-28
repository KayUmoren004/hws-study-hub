import React, { useContext, useEffect } from "react";

// Dependencies
import { Button, StyleSheet, Text, View } from "react-native";
import { FirebaseContext } from "../../shared/src/helpers/FirebaseContext";
import { UserContext } from "../../shared/src/helpers/UserContext";

const Filter = ({ navigation, route }) => {
  // Get Params
  const { setFilteredTFs } = route.params;

  // Reset on mount
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Reset" onPress={() => setFilteredTFs(null)} />
      ),
    });
  }, []);

  // Context
  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);
  return (
    <View style={styles.container}>
      <Text style={{ color: "#fff" }}>Filter</Text>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d",
    alignItems: "center",
    justifyContent: "center",
  },
});
