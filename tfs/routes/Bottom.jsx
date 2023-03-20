import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Colors from "../../shared/src/utils/Colors";
import { UserContext } from "../../shared/src/helpers/UserContext";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// Local Screens
import Home from "../screens/Home";

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
const realtime = getDatabase(app);
const db = getFirestore(app);

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
      case `${sName}`:
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

  const [requestForHelp, setRequestForHelp] = useState(null);

  // Listen for changes in "requestForHelp" collection in firestore where tfUID === User.uid and get its length
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", User.uid, "queue"),
      (querySnapshot) => {
        let counter = 0;
        querySnapshot.forEach((doc) => {
          if (doc.data().tfUID === User.uid) {
            counter++;
          }
        });
        setRequestForHelp(counter);
      }
    );
    return unsubscribe;
  }, []);

  const [unread, setUnread] = useState(0);

  // Listen for unread messages in users/user.uid/
  useEffect(() => {
    const unsubscribe = onValue(
      dbRef(realtime, `users/${User.uid}`),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const d = Object.values(data);
          // console.log("D: ", d.length);
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
      <Tab.Screen
        name={`Hello, ${name}`}
        component={Home}
        options={options(
          ["plus", "filter"],
          () => navigation.navigate("Tags"),
          () => {},
          [25, 25],
          true,
          40,
          Colors.white,
          requestForHelp
        )}
      />
      {/* <Tab.Screen
        name="Request Help"
        component={Help}
        options={options(
          ["search"],
          () => navigation.navigate("Tags"),
          () => {},
          [25]
        )}
      /> */}
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
        name={`${name}`}
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
