// import React from "react";

// // Dependencies
// import { FlatList, StyleSheet, Text, View } from "react-native";
// import Item from "./components/Item";
// import { Divider } from "react-native-paper";

// const Chats = ({ data, navigation }) => {
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         indicatorStyle="white"
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <Item data={item} navigation={navigation} />}
//         // showsVerticalScrollIndicator={false}
//         showsHorizontalScrollIndicator={false}
//         ItemSeparatorComponent={() => (
//           <Divider
//             style={{
//               backgroundColor: "#fff",
//             }}
//           />
//         )}
//       />
//     </View>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     marginTop: 10,

//     // alignItems: "center",
//     // justifyContent: "center",
//   },
// });

// import React, { useState, useRef } from "react";
// import { TextInput, RefreshControl } from "react-native";
// import { FlatList, StyleSheet, Text, View, Animated } from "react-native";
// import Item from "./components/Item";
// import { Divider } from "react-native-paper";

// const Chats = ({ data, navigation }) => {
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     setRefreshing(true);
//     setIsSearchVisible(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const renderHeader = () => {
//     if (isSearchVisible) {
//       return <SearchBar />;
//     } else {
//       return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         indicatorStyle="white"
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <Item data={item} navigation={navigation} />}
//         showsHorizontalScrollIndicator={false}
//         ItemSeparatorComponent={() => (
//           <Divider
//             style={{
//               backgroundColor: "#fff",
//             }}
//           />
//         )}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListHeaderComponent={renderHeader}
//       />
//     </View>
//   );
// };

// const SearchBar = () => {
//   return (
//     <View style={styles.searchBarContainer}>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search for a conversation..."
//         placeholderTextColor="#888"
//       />
//     </View>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     marginTop: 10,
//   },
//   searchBarContainer: {
//     paddingHorizontal: 10,
//     backgroundColor: "#000",
//   },
//   searchBar: {
//     backgroundColor: "#444",
//     borderRadius: 10,
//     color: "#fff",
//     paddingHorizontal: 15,
//     height: 40,
//     marginVertical: 5,
//   },
// });

import React, { useState, useRef } from "react";
import { TextInput, RefreshControl } from "react-native";
import { FlatList, StyleSheet, Text, View, Animated } from "react-native";
import Item from "./components/Item";
import { ActivityIndicator, Divider } from "react-native-paper";

const Chats = ({ data, navigation }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = () => {
    setRefreshing(true);
    setIsSearchVisible(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 100);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        if (event.nativeEvent.contentOffset.y > 50) {
          setIsSearchVisible(false);
        }
      },
    }
  );

  // const filteredData = data.filter((item) => {
  //   const nameMatch = item.name
  //     .toLowerCase()
  //     .includes(searchText.toLowerCase());
  //   const messageMatch = item.message
  //     .toLowerCase()
  //     .includes(searchText.toLowerCase());

  //   return nameMatch || messageMatch;
  // });

  return data ? (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        indicatorStyle="white"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item data={item} navigation={navigation} />}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Divider
            style={{
              backgroundColor: "#fff",
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          isSearchVisible ? (
            <SearchBar onChangeText={setSearchText} />
          ) : (
            <View />
          )
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const SearchBar = ({ onChangeText }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a conversation..."
        placeholderTextColor="#888"
        onChangeText={onChangeText}
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
  },
  searchBarContainer: {
    paddingHorizontal: 10,
    backgroundColor: "#000",
  },
  searchBar: {
    backgroundColor: "#444",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 15,
    height: 40,
    marginVertical: 5,
  },
});
