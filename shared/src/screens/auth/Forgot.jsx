import React, { useState, useContext } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Input } from "@rneui/themed";
import { ForgotSchema } from "../../utils/Validation";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import { FirebaseContext } from "../../helpers/FirebaseContext";

import Container from "../../components/auth/Container";
import Colors from "../../utils/Colors";
import Button from "../../components/auth/AuthButton";

const Forgot = ({ navigation }) => {
  // Context
  const Firebase = useContext(FirebaseContext);

  // State
  const [loading, setLoading] = useState(false);

  // Loading Component
  const Loading = () => {
    return (
      <View>
        <ActivityIndicator size={"large"} color={Colors.languidLavender} />
      </View>
    );
  };

  // Auth Flow
  const AuthFlow = async (values) => {
    setLoading(true);

    const { email } = values;

    try {
      const sent = await Firebase.resetPassword(email);
      if (sent) {
        Alert.alert("Password reset email sent!", "Please check your email.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        alert("Email not found!");
      }
    } catch (err) {
      console.log("Error @Forgot.AuthFlow: ", err.message);
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
        <TouchableOpacity
          style={{
            marginLeft: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={40}
            style={{
              borderColor: Colors.eggshell,
              marginRight: 10,
              borderRadius: 10,
              borderWidth: 2,
              color: Colors.lavenderBlue,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
        {/* Spacer */}
        {/* <View /> */}
        {/* Image */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="unlock" size={100} color={Colors.lavenderBlue} />
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
              Reset Password
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
              }}
              validationSchema={ForgotSchema}
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

                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <Button onPress={props.handleSubmit} label="Send Email" />
                    )}
                  </View>
                  {/* Footer */}
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </Container>
  );
};
export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
