import React, { useContext, useState } from "react";

// Dependencies
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Formik } from "formik";

import {
  NameSchema,
  EmailSchema,
  PasswordSchema,
  PhoneNumberSchema,
} from "../../utils/Validation";

import { UserContext } from "../../helpers/UserContext";
import { FirebaseContext } from "../../helpers/FirebaseContext";
import { Feather } from "@expo/vector-icons";
import Colors from "../../utils/Colors";

const iconList = [
  "user",
  "key",
  "phone",
  "at-sign",
  "check",
  "edit",
  "trash-2",
];

// Update Component
const Update = ({
  title,
  updateValues,
  setUpdateValues,
  icon,
  update,
  props,
}) => {
  // Lowercase title
  const lowerTitle =
    title === "Phone Number" ? "phoneNumber" : title.toLowerCase();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 10,
        padding: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Feather name={iconList[icon]} size={24} color={Colors.lavenderBlue} />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 15,
            flex: 1,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "200",
              fontSize: 20,
              marginBottom: 5,
              textAlign: "left",
            }}
          >
            {title}
          </Text>

          {updateValues[lowerTitle].clicked ? (
            <TextInput
              style={{
                color: "#fff",
                textAlign: "left",
                borderBottomColor: "#fff",
                borderBottomWidth: 1,
                width: "90%",
                paddingVertical: 5,
              }}
              onChangeText={props.handleChange(lowerTitle)}
              value={props.values[lowerTitle]}
              keyboardType={
                title === "Phone Number"
                  ? "phone-pad"
                  : title === "Email"
                  ? "email-address"
                  : "default"
              }
              returnKeyLabel="Save"
              returnKeyType="done"
              onSubmitEditing={() => {
                // Update Value
                setUpdateValues({
                  ...updateValues,
                  [lowerTitle]: {
                    ...updateValues[lowerTitle],
                    clicked: !updateValues[lowerTitle].clicked,
                    value: props.values[lowerTitle],
                  },
                });

                // Update User
                update(props.values[lowerTitle]);
              }}
            />
          ) : (
            <Text style={{ color: "#fff", textAlign: "left" }}>
              {title === "Phone Number"
                ? props.values[lowerTitle].replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  )
                : props.values[lowerTitle]}
            </Text>
          )}
        </View>
      </View>
      {updateValues[lowerTitle].clicked ? (
        <TouchableWithoutFeedback
          onPress={() => {
            // Update Value
            setUpdateValues({
              ...updateValues,
              [lowerTitle]: {
                ...updateValues[lowerTitle],
                clicked: !updateValues[lowerTitle].clicked,
                value: props.values[lowerTitle],
              },
            });

            // Update User
            update(props.values[lowerTitle]);
          }}
        >
          <Feather
            name={iconList[iconList.length - 3]}
            size={24}
            color={Colors.bottleGreen}
          />
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          onPress={() =>
            setUpdateValues({
              ...updateValues,
              [lowerTitle]: {
                ...updateValues[lowerTitle],
                clicked: !updateValues[lowerTitle].clicked,
              },
            })
          }
        >
          <Feather
            name={iconList[iconList.length - 2]}
            size={24}
            color={Colors.lavenderWeb}
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const Settings = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [updateValues, setUpdateValues] = useState({
    name: {
      value: "",
      error: "",
      clicked: false,
    },
    email: {
      value: "",
      error: "",
      clicked: false,
    },
    phoneNumber: {
      value: "",
      error: "",
      clicked: false,
    },
  });

  // console.log("updateValues: ", updateValues);

  // context
  const [User, setUser] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // Delete Account - I have not tested this yet
  const deleteAccount = async () => {
    // Alert to check if user wants to delete account
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Delete account
            setLoading(true);

            try {
              const deleted = await Firebase.Auth.deleteUserData(User.uid);

              if (deleted) {
                // Clear user context
                setUser((state) => ({ ...state, isLoggedIn: false }));
                // Sign user out
                const loggedOut = await Firebase.Auth.signOut();
                if (loggedOut) {
                  setUser((state) => ({ ...state, isLoggedIn: false }));
                } else {
                  console.log("Error @deleteAccount.logOut: ", err.message);
                }
              } else {
                console.log("Error @deleteAccount: ", err.message);
              }
            } catch (err) {
              console.log("Error @deleteAccount: ", err.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Update Values
  const updateAccount = async (field, value) => {
    console.log("Update Value: ", value);
    const updatedUser = {
      // Copy the rest of the user object but do not overwrite the values that were updated
      ...User,
      // Overwrite the values that were updated
      [field]:
        value === "" || value === null || value === undefined
          ? User[field]
          : value,
    };

    // console.log("Updated User: ", updatedUser);
    try {
      const updated = await Firebase.Auth.updateUserData(User.uid, updatedUser);

      if (updated) {
        setUser((state) => ({ ...state, ...updatedUser }));
      } else {
        console.log("Error @updateAccount: ", err.message);
      }
    } catch (err) {
      console.log("Error @updateAccount: ", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Name */}
        <View
          style={{
            padding: 10,
          }}
        >
          <Formik
            initialValues={{
              name: User.name,
            }}
            validationSchema={NameSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {(props) => (
              <Update
                title="Name"
                updateValues={updateValues}
                setUpdateValues={setUpdateValues}
                icon={0}
                update={(value) => updateAccount("name", value)}
                props={props}
              />
            )}
          </Formik>
        </View>
        {/* Email */}
        <View
          style={{
            padding: 10,
          }}
        >
          <Formik
            initialValues={{
              email: User.email,
            }}
            validationSchema={EmailSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {(props) => (
              <Update
                title="Email"
                updateValues={updateValues}
                setUpdateValues={setUpdateValues}
                icon={3}
                update={(value) => updateAccount("email", value)}
                props={props}
              />
            )}
          </Formik>
        </View>
        {/* Phone Number */}
        <View
          style={{
            padding: 10,
          }}
        >
          <Formik
            initialValues={{
              phoneNumber: User.phoneNumber || "",
            }}
            validationSchema={PhoneNumberSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {(props) => (
              <Update
                title="Phone Number"
                updateValues={updateValues}
                setUpdateValues={setUpdateValues}
                icon={2}
                update={(value) => updateAccount("phoneNumber", value)}
                props={props}
              />
            )}
          </Formik>
        </View>
      </View>
      {/* Danger Zone */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Feather
            name={iconList[iconList.length - 1]}
            size={24}
            color="#FAA0A0"
          />
          <Text
            style={{
              color: "#FAA0A0",
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Danger Zone
          </Text>
        </View>
        {/* Delete Account */}
        <View>
          <Button
            title="Delete Account"
            color="#ff0000"
            onPress={() => deleteAccount()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // alignItems: "center",
    justifyContent: "space-between",
  },
});
