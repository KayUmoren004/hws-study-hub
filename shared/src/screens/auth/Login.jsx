import React, { useState, useContext } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Input } from "@rneui/themed";
import { LoginSchema } from "../../utils/Validation";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";

import { UserContext } from "../../helpers/UserContext";
import { FirebaseContext } from "../../helpers/FirebaseContext";

import Container from "../../components/auth/Container";
import Colors from "../../utils/Colors";
import Button from "../../components/auth/AuthButton";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const Login = ({ navigation }) => {
  // Context
  const [_, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // State
  const [loading, setLoading] = useState(false);

  // Auth Flow
  const AuthFlow = async (values) => {
    setLoading(true);

    const { email, password } = values;

    try {
      await Firebase.Auth.signIn(email, password);
      const uid = Firebase.Auth.getCurrentUser().uid;

      const userInfo = await Firebase.Auth.getUserData(uid);
      setUser({
        ...userInfo,
        isLoggedIn: true,
      });
    } catch (err) {
      console.log("Error @Login.AuthFlow: ", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Spacer */}
        <View />
        {/* Image */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="key" size={100} color={Colors.lavenderBlue} />
        </View>
        <View>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </View>

          {/* Body */}
          <View
            style={{
              padding: 10,
            }}
          >
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                AuthFlow(values);
              }}
            >
              {(props) => (
                <View>
                  {/* Email */}
                  <Input
                    placeholder="Enter your email"
                    onChangeText={props.handleChange("email")}
                    value={props.values.email}
                    onSubmitEditing={props.handleSubmit}
                    inputStyle={{
                      color: Colors.white,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.white,
                      borderBottomWidth: 1,
                    }}
                    errorMessage={props.errors.email}
                    leftIcon={{
                      type: "feather",
                      name: "at-sign",
                      color: Colors.lavenderBlue,
                    }}
                    autoComplete="email"
                    autoCapitalize="none"
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />
                  {/* Password */}
                  <Input
                    placeholder="Enter your password"
                    onChangeText={props.handleChange("password")}
                    value={props.values.password}
                    onSubmitEditing={props.handleSubmit}
                    inputStyle={{
                      color: Colors.white,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.white,
                      borderBottomWidth: 1,
                    }}
                    errorMessage={props.errors.password}
                    leftIcon={{
                      type: "feather",
                      name: "lock",
                      color: Colors.lavenderBlue,
                    }}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Forgot")}
                      >
                        <Text
                          style={{
                            color: Colors.lavenderBlue,
                            fontSize: 17,
                          }}
                        >
                          Forgot?
                        </Text>
                      </TouchableOpacity>
                    }
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />

                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <Button onPress={props.handleSubmit} label="Login" />
                    )}
                  </View>
                  {/* Footer */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      paddingTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 17,
                        textAlign: "center",
                      }}
                    >
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("S1")}>
                      <Text
                        style={{
                          color: Colors.lavenderBlue,
                          fontSize: 17,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </Container>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
