import React, { useContext, useEffect, useRef, useState } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Divider } from "react-native-paper";
import { SearchBar } from "@rneui/themed";
import { FirebaseContext } from "../../../../shared/src/helpers/helpers/FirebaseContext";
import Colors from "../../../utils/Colors";
import Header from "../Header";
import Bar from "../search/Bar";
import Tag from "./Tag";
import { Feather, Ionicons } from "@expo/vector-icons";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const TagSelector = ({ navigation }) => {
  // Context
  const Firebase = useContext(FirebaseContext);

  // State
  const [majorsMinors, setMajorsMinors] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [cloudTags, setCloudTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);
  const [search, setSearch] = useState("");

  // Get Majors and Minors
  const getMajorsAndMinors = async () => {
    try {
      const { db, ref, child, get, onValue, query } =
        await Firebase.getMajorsAndMinors();

      // Get Majors & Minors
      const majorsRef = ref(db, "majors-minors");
      onValue(majorsRef, (snapshot) => {
        const data = snapshot.val();
        setMajorsMinors(data);
      });
    } catch (err) {
      console.log("Error @TagSelector.getMajorsAndMinors: ", err.message);
    }
  };

  // Get Cloud Tags
  const getCloudTags = async () => {
    try {
      const q = await Firebase.getAllTags();

      setCloudTags(q);
    } catch (err) {
      console.log("Error @TagSelector.getCloudTags: ", err.message);
    }
  };

  console.log("TagSelector.jsx: ", tagsSelected);

  // Save Tags
  const saveTags = async () => {
    setLoading(true);
    try {
      // Add tags to user profile
      const saved = await Firebase.addTags(tagsSelected);

      if (saved) {
        // Navigate to Home Screen
        navigation.goBack();
      }
    } catch (err) {
      console.log("Error @TagSelector.saveTags: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call on Mount
  useEffect(() => {
    getCloudTags();
    getMajorsAndMinors();
  }, []);

  // Close
  const close = () => {
    Alert.alert(
      "Are you sure?",
      "You will lose all unsaved tags.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.goBack(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // Search
  const filterTags = (val) => {
    setSearch(val);

    // Search for tag based on search input on search bar in majors-minors
    const filteredTags = majorsMinors.filter((tag) => {
      // If search input is empty, return all tags
      if (search === "") {
        return majorsMinors;
      }

      return tag.toLowerCase().includes(search.toLowerCase());
    });

    setMajorsMinors(filteredTags);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 30,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={{}} onPress={() => close()}>
            <View
              style={{
                color: Colors.lavenderBlue,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="close"
                size={30}
                style={{
                  color: "#FF0000",
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder="Search for Courses"
          onChangeText={filterTags}
          value={search}
          platform="ios"
          containerStyle={{ backgroundColor: "#000", padding: 15 }}
          cancelButtonProps={{ marginRight: 10 }}
          cancelButtonTitle="Cancel"
          onClear={() => {
            setSearch("");
            getMajorsAndMinors();
          }}
          onCancel={() => {
            setSearch("");
            getMajorsAndMinors();
          }}
          onSubmitEditing={() => {
            if (!majorsMinors.includes(search)) {
              Alert.alert("Error", "No results found", [
                {
                  text: "OK",
                  onPress: () => {
                    setSearch("");
                    getMajorsAndMinors();
                  },
                  style: "cancel",
                },
              ]);
            }
          }}
        />
      </View>
      <Divider style={{ marginTop: 10 }} />
      <FlatList
        data={majorsMinors}
        renderItem={({ item }) => (
          <Tag
            tag={item}
            selectedTags={tagsSelected}
            setSelectedTags={setTagsSelected}
            cloudTags={cloudTags}
            setCloudTags={setCloudTags}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <Divider />}
        style={{}}
        // ListHeaderComponent={() => <Bar />}
      />
      <View
        style={{
          paddingHorizontal: 30,
        }}
      >
        {loading && <Loading />}
        {!loading && (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              //flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
              height: 50,
            }}
            onPress={() => saveTags()}
          >
            <Text style={{ color: "#000", textAlign: "center" }}>
              Save Tags
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TagSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
