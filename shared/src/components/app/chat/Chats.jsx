import React from "react";

// Dependencies
import { FlatList, StyleSheet, Text, View } from "react-native";
import Item from "./components/Item";
import { Divider } from "react-native-paper";

const Chats = ({ data, navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        indicatorStyle="white"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Item data={item} navigation={navigation} />}
        // showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              backgroundColor: "#fff",
            }}
          />
        )}
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: 10,

    // alignItems: "center",
    // justifyContent: "center",
  },
});
