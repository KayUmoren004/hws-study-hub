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
import { Feather, Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../helpers/UserContext";
import { FirebaseContext } from "../../helpers/FirebaseContext";

import Container from "../../components/auth/Container";
import Colors from "../../utils/Colors";
import Button from "../../components/auth/AuthButton";
import { collectionGroup } from "firebase/firestore";

const Verify = ({ navigation }) => {
  // Context
  const Firebase = useContext(FirebaseContext);
  const [_, setUser] = useContext(UserContext);

  const [es, setEs] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  // // Run on mount
  // React.useEffect(() => {
  //   VerifyEmail();
  // }, []);

  // Set Button Pressed to false every 60 seconds
  React.useEffect(() => {
    if (buttonPressed) {
      const interval = setInterval(() => {
        setButtonPressed(false);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, []);

  // Verify Email
  const VerifyEmail = async () => {
    const emailSent = await Firebase.verifyEmail();

    console.log("Email Sent: ", emailSent);

    if (emailSent) {
      setEs(true);

      // Get Current User - Auth
      const user = Firebase.getCurrentUser();

      // Check if user is verified
      if (user.emailVerified) {
        navigation.replace("Home");
      }
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
          onPress={() => navigation.replace("Login")}
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
              justifyContent: "center",
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
              Verify Account
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 25,
                fontWeight: "200",
                textAlign: "center",
              }}
            >
              Please check your email to verify your account
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {es ? (
              <Text
                style={{
                  color: Colors.lavenderBlue,
                  fontSize: 25,
                  fontWeight: "200",
                  textAlign: "center",
                }}
              >
                The Verification email was successfully sent to your email
              </Text>
            ) : (
              <Text
                style={{
                  color: Colors.lavenderBlue,
                  fontSize: 25,
                  fontWeight: "200",
                  textAlign: "center",
                }}
              >
                Sending...
              </Text>
            )}
          </View>
          {/* Body */}
          <View
            style={{
              padding: 10,
              marginBottom: 30,
            }}
          >
            <Button
              label="Send Email"
              onPress={() => VerifyEmail()}
              destructive={false}
              disabled={buttonPressed}
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
