import React, { useContext, useEffect } from "react";

// Dependencies
import { ActivityIndicator, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { FirebaseContext } from "../../helpers/FirebaseContext";
import { UserContext } from "../../helpers/UserContext";
import Auth from "../../routes/Auth";
import Routes from "../../routes/Routes";
import useOnlinePresence from "../../helpers/hooks/useOnlinePresence";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 32,
          textAlign: "center",
        }}
      >
        HWS Study Hub{"\n"}
        Version 1.0
      </Text>

      <LottieView
        source={require("../../../../assets/Loading.json")}
        autoPlay
        loop
        style={{
          width: "100%",
          height: 100,
        }}
      />
    </View>
  );
};

const Loading = () => {
  // Context
  const [User, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // Get Current User
  const currentUser = async () => {
    // Get User
    const user = Firebase.Auth.getCurrentUser();

    // Check if user exists
    if (user) {
      // UID
      const uid = user.uid;

      // Get User Data
      const doc = await Firebase.Auth.getUserData(uid);

      // Set User Data
      if (doc) {
        const authUser = {
          name: doc.name,
          email: doc.email,
          phoneNumber: doc.phoneNumber,
          uid: doc.uid,
          isLoggedIn: true,
          profilePhotoUrl: doc.profilePhotoUrl,
          isEmailVerified: doc.isEmailVerified,
          isPhoneVerified: doc.isPhoneVerified,
          tags: doc.tags,
          status: "",
          isTF: doc.isTF,
          totalHelped: doc.totalHelped,
        };
        setUser(authUser);
      }
    } else {
      setUser((state) => ({ ...state, isLoggedIn: false }));
    }
  };

  // Auth State
  const AuthState = () => {
    return Firebase.Auth.checkAuth((user) => {
      if (user) {
        currentUser();
      } else {
        setUser((state) => ({ ...state, isLoggedIn: false }));
      }
    });
  };

  // On Mount, get user data from Firebase
  useEffect(() => {
    setTimeout(async () => {
      AuthState();
    }, 500);
  }, []);

  return User.isLoggedIn === null ? (
    <Loader />
  ) : User.isLoggedIn === false ? (
    <Auth />
  ) : (
    <Routes />
  );
};

export default Loading;
