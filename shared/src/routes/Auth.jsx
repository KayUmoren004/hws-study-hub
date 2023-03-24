import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Login from "../screens/auth/Login";
import Signup from "../screens/auth/signup/SignUp";
import S1 from "../screens/auth/signup/S1";
import Verify from "../screens/auth/Verify";
import Forgot from "../screens/auth/Forgot";

import useOnlinePresence from "../helpers/hooks/useOnlinePresence";

const Auth = () => {
  // Nav
  const Stack = createNativeStackNavigator();

  // Hooks
  useOnlinePresence();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="S1" component={S1} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="Forgot" component={Forgot} />
    </Stack.Navigator>
  );
};

export default Auth;
