import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Bottom from "./Bottom";
import Tags from "../../shared/src/screens/app/Tags";
import Settings from "../../shared/src/screens/app/Settings";
import Notifications from "../../shared/src/screens/app/Notifications";
import Chats from "../../shared/src/components/app/chat/Chats";

const App = ({ navigation }) => {
  // Nav
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Bottom"
    >
      <Stack.Screen name="Bottom" component={Bottom} />
      <Stack.Screen name="Tags" component={Tags} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Messages" component={Chats} />
    </Stack.Navigator>
  );
};

export default App;
