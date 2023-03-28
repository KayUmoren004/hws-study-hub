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

import CachedImage from "expo-cached-image";
import FakeImage from "../../components/app/profile/FakeImage";

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
            {/* <Image
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
            /> */}

            <CachedImage
              source={{
                uri: `${User.profilePhotoUrl}`, // (required) -- URI of the image to be cached
                // headers: `Authorization: Bearer ${token}`, // (optional)
                expiresIn: 2_628_288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
              }}
              cacheKey={`${User.uid}-thumb`} // (required) -- key to store image locally
              placeholderContent={
                // (optional) -- shows while the image is loading
                <FakeImage
                  width={128}
                  height={128}
                  borderRadius={64}
                  name={User.name}
                />
              }
              resizeMode="contain" // pass-through to <Image /> tag
              style={
                // pass-through to <Image /> tag
                {
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                }
              }
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
