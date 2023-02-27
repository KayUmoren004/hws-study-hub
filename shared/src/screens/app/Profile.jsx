// TODO: fix the profile photo loading time

import React, { useContext } from "react";

// Dependencies
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { UserContext } from "../../helpers/UserContext";
import Colors from "../../utils/Colors";
import Delimitated from "../../../../shared/src/components/app/Tag/Delimitated";

const courses = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Psychology",
];

const Profile = ({ navigation }) => {
  const [User] = useContext(UserContext);

  // Load image on mount
  const [image, setImage] = React.useState(null);
  React.useEffect(() => {
    if (User.profilePhotoUrl !== "default") {
      (async () => {
        const response = await fetch(User.profilePhotoUrl);
        const blob = await response.blob();
        setImage(URL.createObjectURL(blob));
      })();
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Profile Photo and Name */}
        <View>
          {/* Settings */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 5,
              right: 20,
              width: 32,
              height: 32,

              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Settings")}
          >
            <Feather name="settings" size={24} color="#fff" />
          </TouchableOpacity>
          {/* Profile Photo */}
          <View
            style={{
              // shadowOpacity: 0.5,
              marginTop: 15,
              shadowRadius: 30,
              shadowColor: "#d2d2d2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                User.photo === "default"
                  ? require("../../../../assets/icon.png")
                  : { uri: image }
              }
              style={{
                width: 128,
                height: 128,
                borderRadius: 64,
              }}
              resizeMode="contain"
            />
          </View>
          {/* Name and Status */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
              {User.name}
            </Text>
            <Text
              style={{
                color: Colors.bottleGreen,
                fontSize: 20,
                fontWeight: "200",
              }}
            >
              {User.status}
            </Text>
          </View>
        </View>

        {/* Middler */}
        <View
          style={{
            flex: 1,
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          {/* Courses */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "flex-start",
              // marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            {/* Courses */}
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              Courses
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {User.tags.map((course, idx) => {
                // Ignore the "default" tag
                if (course === "default") return null;
                return <Delimitated key={idx} tag={course} />;
              })}
            </View>
          </View>

          {/* Stats */}
          {User.isTF ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // marginHorizontal: 10,
                // marginVertical: 20,
              }}
            >
              {/* Stats */}
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Stats
              </Text>
              {/* Stats  */}
              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  Total Helped: {User.totalHelped}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Log out */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            <Button title="Log out" onPress={() => console.log("Log Out")} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
