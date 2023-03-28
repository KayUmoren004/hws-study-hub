// TODO: Add visibility right button for password input

import React, { useState, useContext } from "react";

// Dependencies
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { Input } from "@rneui/themed";
import { SignUpSchema } from "../../../utils/Validation";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import { UserContext } from "../../../helpers/UserContext";
import { FirebaseContext } from "../../../helpers/FirebaseContext";

import Container from "../../../components/auth/Container";
import Colors from "../../../utils/Colors";
import Button from "../../../components/auth/AuthButton";

import * as ImagePicker from "expo-image-picker";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const SignUp = ({ navigation, route }) => {
  // Params
  const { name, email } = route.params;

  // Context
  const [_, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // State
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const [profilePhoto, setProfilePhoto] = useState(false);

  // Visibility
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return status;
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1.0,
      });

      if (!result.canceled) {
        // console.log("result: ", result);
        // console.log("Set Photo Input: ", result.assets[0].uri);
        setProfilePhoto(result.assets[0].uri);
      }
    } catch {
      console.log("Error @pickImage: ", error);
    }
  };

  const addProfilePhoto = async () => {
    const status = await getPermission();

    if (status !== "granted") {
      alert("We need permission to access your camera roll.");

      return;
    }

    pickImage();
  };

  // Auth Flow
  const AuthFlow = async (values) => {
    //  console.log("AuthFlow: ", values);
    setLoading(true);
    const { password, confirmPassword } = values;

    const actualPassword = password === confirmPassword ? password : null;

    const fullUser = {
      email,
      actualPassword,
      name,
      profilePhoto,
      tags: ["default"],
      totalHelped: 0,
    };

    try {
      if (profilePhoto === false || profilePhoto === null) {
        alert("Please add a profile photo");
      } else {
        const createdUser = await Firebase.Auth.createUser(fullUser);

        setUser({ ...createdUser, isLoggedIn: true });
      }
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

        {/* <View /> */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 10,
              }}
              onPress={() => navigation.goBack()}
            >
              <View
                style={{
                  flex: 1,
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
              >
                <Ionicons
                  name="chevron-back"
                  size={40}
                  style={{
                    color: Colors.lavenderBlue,
                    //   flex: 1,
                    //  //  borderColor: Colors.eggshell,
                    //   marginRight: 10,
                    //   borderRadius: 10,
                    //   borderWidth: 2,
                    //   color: Colors.lavenderBlue,
                    //   width: 50,
                    //   height: 50,
                    //   alignItems: "center",
                    //   justifyContent: "center",
                  }}
                />
              </View>
            </TouchableOpacity>
            <View>
              <Feather name="user-plus" size={50} color={Colors.white} />
            </View>
            <View>
              <Feather name="user-plus" size={50} color={Colors.black} />
            </View>
          </View>
        </View>

        <View>
          {/* Body */}
          <View
            style={{
              padding: 10,
            }}
          >
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
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignUpSchema}
              onSubmit={(values) => AuthFlow(values)}
            >
              {(props) => (
                <View>
                  {/* Image Picker */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // marginBottom: 10,
                      width: "100%",
                      borderWidth: 1,
                      borderColor: Colors.languidLavender,
                      borderRadius: 10,
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => {
                      //   console.log("Image Picker");
                      // }}
                      onPress={addProfilePhoto}
                      style={{
                        flex: 1,
                        // justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 100,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: Colors.languidLavender,
                          padding: 5,
                        }}
                      >
                        {profilePhoto ? (
                          <Image
                            source={{ uri: profilePhoto }}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 100,
                              resizeMode: "contain",
                            }}
                          />
                        ) : (
                          <Feather name="user" size={50} color={Colors.white} />
                        )}
                      </View>
                      {/* Text */}
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: profilePhoto
                              ? Colors.lavenderBlue
                              : Colors.white,
                            fontSize: 17,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {profilePhoto
                            ? "Profile Photo Added"
                            : "Add Profile Photo"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* Spacer */}
                  <View style={{ height: 10 }} />

                  {/* Password */}
                  <Input
                    placeholder="Create your password"
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
                    secureTextEntry={true}
                    autoCapitalize="none"
                  />
                  {/* Spacer */}
                  <View style={{ height: 10 }} />
                  {/* Confirm Password */}
                  <Input
                    placeholder="Confirm your password"
                    onChangeText={props.handleChange("confirmPassword")}
                    value={props.values.confirmPassword}
                    onSubmitEditing={props.handleSubmit}
                    inputStyle={{
                      color: Colors.white,
                      fontSize: 17,
                    }}
                    inputContainerStyle={{
                      borderBottomColor: Colors.white,
                      borderBottomWidth: 1,
                    }}
                    errorMessage={props.errors.confirmPassword}
                    leftIcon={{
                      type: "feather",
                      name: "lock",
                      color: Colors.lavenderBlue,
                    }}
                    // rightIcon={{
                    //   type: "feather",
                    //   name: "check-circle",
                    //   color: Colors.lavenderBlue,
                    // }}
                    secureTextEntry={true}
                    autoCapitalize="none"
                  />
                  <View>
                    {/* Submit */}
                    {loading && <Loading />}
                    {!loading && (
                      <Button onPress={props.handleSubmit} label="Sign Up" />
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

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
