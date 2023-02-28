import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Colors from "../../shared/src/utils/Colors";
import { UserContext } from "../../shared/src/helpers/UserContext";
import { useContext } from "react";
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
  shown = true
) => ({
  headerShown: shown,
  headerTitleStyle: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.white,
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

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={`Hello, ${name}`}
        component={Home}
        options={options(
          ["", "plus"],
          () => {},
          () => navigation.navigate("Tags"),
          [0, 30]
        )}
      />
      <Tab.Screen
        name="Request Help"
        component={Help}
        options={options(
          ["", "filter"],
          () => {},
          () => {},
          [25, 25]
        )}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={options(
          ["bell", "search"],
          () => navigation.navigate("Notifications"),
          () => navigation.navigate("Search"),
          [25, 25]
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
          false
        )}
      />
    </Tab.Navigator>
  );
};

export default Bottom;
