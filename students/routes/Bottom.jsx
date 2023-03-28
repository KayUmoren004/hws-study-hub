import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Colors from "../../shared/src/utils/Colors";
import { UserContext } from "../../shared/src/helpers/UserContext";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// Local Screens
import Home from "../screens/Home";
import Help from "../screens/Help";

// Shared Screens
import Chat from "../../shared/src/screens/app/Chat";
import Profile from "../../shared/src/screens/app/Profile";
import Tags from "../../shared/src/screens/app/Tags";
import Notifications from "../../shared/src/screens/app/Notifications";
import Settings from "../../shared/src/screens/app/Settings";

// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  arrayRemove,
  serverTimestamp,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import {
  getDatabase,
  child,
  get,
  onValue,
  ref as dbRef,
  query,
  push,
  onChildAdded,
  off,
  set,
  onDisconnect,
  remove,
  serverTimestamp as dbServerTimestamp,
  orderByChild,
  limitToLast,
  update,
} from "firebase/database";
import FirebaseConfig from "../../shared/src/helpers/config/FirebaseConfig";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);

let sName;

// Screen Options
const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: Colors.black,
    borderTopColor: "transparent",
  },
  tabBarShowLabel: false,
  tabBarActiveTintColor: Colors.lavenderBlue,
  tabBarInactiveTintColor: Colors.darkGray,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    switch (route.name) {
      case "Home":
        iconName = "grid";
        break;
      case "Request Help":
        iconName = "search";
        break;
      case "Profile":
        iconName = "user";
        break;
      case "Chat":
        iconName = "message-circle";
        break;
      // case "Reminders":
      //   iconName = "bell";
      //   break;
      // case "Courses":
      //   iconName = "book-open";
      //   break;

      default:
        iconName = "home";
    }

    return <Feather name={iconName} size={size} color={color} />;
  },
});

// Options
const options = (
  rightIcon,
  onPress,
  onPressSecond,
  rightIconSize = 30,
  shown = true,
  fontSize = 40,
  fontColor = Colors.white,
  counter = null
) => ({
  headerShown: shown,
  tabBarBadge: counter === null || counter === 0 ? null : counter,
  headerTitleStyle: {
    fontSize: fontSize,
    fontWeight: "bold",
    color: fontColor,
  },
  headerStyle: {
    backgroundColor: Colors.black,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleAlign: "left",
  headerRight: () => (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPress}
      >
        <Feather
          name={rightIcon[0]}
          size={rightIconSize[0]}
          color={Colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          marginRight: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPressSecond}
      >
        <Feather
          name={rightIcon[1]}
          size={rightIconSize[1]}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  ),
});

const Bottom = ({ navigation }) => {
  // Tab
  const Tab = createBottomTabNavigator();

  // User
  const [User] = useContext(UserContext);

  // Name
  const name = User.name.slice(0, User.name.indexOf(" "));

  // on mount set sName to name
  if (!sName) {
    sName = name;
  }

  const [unread, setUnread] = useState(0);

  // Listen for unread messages in users/user.uid/
  useEffect(() => {
    const unsubscribe = onValue(
      dbRef(realtime, `users/${User.uid}`),
      (snapshot) => {
        const data = snapshot.val();
        // console.log("Data: ", data);
        const d = [];
        for (const key in data) {
          if (data[key].unread) {
            const z = data[key].unread;
            for (const k in z) {
              if (z[k]) {
                d.push(z[k]);
              }
            }
          }
        }

        if (d.length > 0) {
          setUnread(d.length);
        } else {
          setUnread(0);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {/* <Tab.Screen
        name={`Hello, ${name}`}
        component={Home}
        options={options(
          ["", "plus"],
          () => {},
          () => navigation.navigate("Tags"),
          [0, 30]
        )}
      /> */}
      <Tab.Screen
        name={`Hello, ${name}`}
        component={Help}
        options={options(
          ["plus", "filter"],
          () => {},
          () => {},
          [25, 25]
        )}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={options(
          ["", ""],
          () => {},
          () => {},
          // ["bell", "search"],
          // () => navigation.navigate("Notifications"),
          // () => navigation.navigate("Search"),
          [25, 25],
          true,
          40,
          Colors.white,
          unread
        )}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={options(
          ["", "settings"],
          () => {},
          () => navigation.navigate("Settings"),
          [0, 20],
          false,
          20,
          Colors.black
        )}
      />
    </Tab.Navigator>
  );
};

export default Bottom;
