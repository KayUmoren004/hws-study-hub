import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Bottom from "./Bottom";
import Tags from "../../shared/src/screens/app/Tags";
import Settings from "../../shared/src/screens/app/Settings";
import Notifications from "../../shared/src/screens/app/Notifications";
import Chats from "../../shared/src/components/app/chat/Chats";
import Filter from "../screens/Filter";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Person from "../../shared/src/components/app/profile/Person";

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
      />
      <Stack.Screen
        name="Person"
        component={Person}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
