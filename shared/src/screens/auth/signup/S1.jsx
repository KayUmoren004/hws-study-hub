import React, { useState, useContext } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Input } from "@rneui/themed";
import { S1Schema } from "../../../utils/Validation";
import { Feather } from "@expo/vector-icons";
import { Formik } from "formik";

import { UserContext } from "../../../helpers/UserContext";
import { FirebaseContext } from "../../../helpers/FirebaseContext";

import Container from "../../../components/auth/Container";
import Colors from "../../../utils/Colors";
import Button from "../../../components/auth/AuthButton";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const S1 = ({ navigation }) => {
  // Context
  const [_, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // State
  const [loading, setLoading] = useState(false);

  // Auth Flow
  const AuthFlow = async (values) => {
    setLoading(true);

    const { name, email } = values;

    try {
      navigation.navigate("SignUp", { name, email });
    } catch (err) {
      console.log("Error @SignUp.AuthFlow: ", err.message);
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather
            name="user-plus"
            //size={isKeyboardOpen ? 0 : 100}
            size={100}
            color={Colors.languidLavender}
          />
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
              Sign Up
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
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                profilePhoto: "",
              }}
              validationSchema={S1Schema}
              onSubmit={(values) => AuthFlow(values)}
            >
              {(props) => (
                <View>
                  {/* Name */}
                  <Input
                    placeholder="First and Last Name"
                    onChangeText={props.handleChange("name")}
                    value={props.values.name}
                    onSubmitEditing={props.handleSubmit}
                    inputStyle={{
                      color: Colors.white,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.white,
                      borderBottomWidth: 1,
                    }}
                    errorMessage={props.errors.name}
                    leftIcon={{
                      type: "feather",
                      name: "user",
                      color: Colors.lavenderBlue,
                    }}
                    autoComplete="name"
                    autoCapitalize="none"
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />
                  {/* Email */}
                  <Input
                    placeholder="Email"
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

                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <Button onPress={props.handleSubmit} label="Next" />
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
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text
                        style={{
                          color: Colors.lavenderBlue,
                          fontSize: 17,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Log in
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

export default S1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
