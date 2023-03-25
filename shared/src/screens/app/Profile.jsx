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
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../../helpers/UserContext";
import Colors from "../../utils/Colors";
import Delimitated from "../../../../shared/src/components/app/Tag/Delimitated";
import { FirebaseContext } from "../../helpers/FirebaseContext";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const Profile = ({ navigation }) => {
  const [User, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // State
  const [isLoading, setIsLoading] = React.useState(false);

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const loggedOut = await Firebase.Auth.signOut();
      if (loggedOut) {
        setUser((state) => ({ ...state, isLoggedIn: false }));
      }
    } catch (err) {
      console.log("Error @signOut: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load image on mount
  const [image, setImage] = React.useState(null);

  // console.log("User: ", User.localPhotoUrl);

  React.useEffect(() => {
    if (User.profilePhotoUrl !== "default") {
      if (
        (image === null || image === undefined || image === "") &&
        User.localPhotoUrl !== null &&
        User.localPhotoUrl !== undefined &&
        User.localPhotoUrl !== ""
      ) {
        setImage(User.localPhotoUrl);
      } else {
        (async () => {
          const response = await fetch(User.profilePhotoUrl);
          const blob = await response.blob();
          setImage(URL.createObjectURL(blob));
        })();
      }
    }
  }, [User]);

  // console.log(User);

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
          <View // Add a View container
            style={{
              justifyContent: "flex-end", // Added justifyContent property
              alignItems: "flex-end", // Added alignItems property
              paddingRight: 16, // Added paddingRight for spacing from the right edge
              paddingTop: 8, // Added paddingTop for spacing from the top edge
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Feather name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Profile Photo */}
          <View
            style={{
              marginTop: 15,
              shadowRadius: 30,
              shadowColor: "#d2d2d2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                User.profilePhotoUrl === "default"
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
            {isLoading && <Loading />}
            {!isLoading && (
              <Button title="Sign Out" onPress={() => signOut()} />
            )}
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
