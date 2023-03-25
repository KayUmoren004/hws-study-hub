import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Bottom from "./Bottom";
import Tags from "../../shared/src/screens/app/Tags";
import Settings from "../../shared/src/screens/app/Settings";
import Notifications from "../../shared/src/screens/app/Notifications";
import Chats from "../../shared/src/components/app/chat/Chats";
// import Filter from "../screens/Filter";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Person from "../../shared/src/components/app/profile/Person";
import CPerson from "../../shared/src/components/app/chat/components/CPerson";

import Message from "../../shared/src/components/app/chat/components/Chat";
import Requests from "../screens/Requests";
const App = () => {
  // Nav
  const Stack = createNativeStackNavigator();

  // use navigation
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerShown: false,
        }
      }
      initialRouteName="Bottom"
    >
      <Stack.Screen
        name="Bottom"
        component={Bottom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Tags"
        component={Tags}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          // headerShown: false,
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Chats}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="Filter"
        component={Filter}
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#1d1d1d",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerLeft: () => (
            <Feather
              name="x"
              size={24}
              color="#FF0000"
              style={{ marginRight: 20 }}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => <Button title="Reset" />,
        }}
      /> */}
      <Stack.Screen
        name="Person"
        component={Person}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Message"
        component={Message}
        options={
          {
            // headerShown: false,
          }
        }
      />
      <Stack.Screen
        name="Chat Person"
        component={CPerson}
        options={{
          // headerShown: false,
          // Set header to transparent
          headerTransparent: true,
          headerTintColor: "#b8c5f5ff",
          headerTitleStyle: {
            color: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="My Requests"
        component={Requests}
        options={{
          presentation: "modal",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1d1d1d",
          },
          // headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#fff",
          },
          // headerLeft: () => <Button title="Close" />,
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
