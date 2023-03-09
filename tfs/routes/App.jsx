import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Bottom from "./Bottom";
import Tags from "../../shared/src/screens/app/Tags";
import Settings from "../../shared/src/screens/app/Settings";
import Notifications from "../../shared/src/screens/app/Notifications";
import Chats from "../../shared/src/components/app/chat/Chats";
import Message from "../../shared/src/components/app/chat/components/Chat";
import Person from "../../shared/src/components/app/profile/Person";
import CPerson from "../../shared/src/components/app/chat/components/CPerson";

const App = ({ navigation }) => {
  // Nav
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Bottom">
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
          headerShown: false,
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
        name="Person"
        component={Person}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Chat Person"
        component={CPerson}
        options={{
          // headerShown: false,
          // Set header to transparent
          headerTransparent: true,
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "transparent",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
