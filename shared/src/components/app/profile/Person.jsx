import { Feather } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import { Formik } from "formik";
import React, { useContext, useState } from "react";

// Dependencies
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Divider } from "react-native-paper";
import { FirebaseContext } from "../../../helpers/FirebaseContext";
import { UserContext } from "../../../helpers/UserContext";
import Colors from "../../../utils/Colors";
import { RequestHelp } from "../../../utils/Validation";
import Delimitated from "../Tag/Delimitated";
import Tag from "../Tag/Tag";

// Loading Component
const Loading = () => {
  return (
    <View>
      <ActivityIndicator size={"large"} color={Colors.languidLavender} />
    </View>
  );
};

const Person = ({ route, navigation }) => {
  const { person, data } = route.params;

  // context
  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  // state
  const [tag, setTag] = useState("");
  const [requested, setRequested] = useState(false);
  const [helpR, setHelpR] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get First Name from person.name
  const fName = person.name.split(" ")[0];

  // Request for help
  const requestHelp = async (values) => {
    setLoading(true);
    try {
      const { title, description } = values;

      const helpRequested = await Firebase.App.requestForHelp(
        title,
        description,
        person.uid
      );

      if (helpRequested) {
        setHelpR(true);

        // Add Request to User's Pending Requests
        const addRequest = await Firebase.App.addUserRequestToPending(
          title,
          description,
          person.uid
        );

        if (addRequest) {
          // Go back to the home screen
          navigation.goBack();
        }
      }
    } catch (err) {
      console.log("Error @Person.jsx: requestHelp: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* Profile Photo and Name */}
        <View>
          {/* Profile Photo */}
          <View
            style={{
              shadowOpacity: 0.8,
              marginTop: 44,
              shadowRadius: 30,
              shadowColor: "#d2d2d2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                person.photo === "default"
                  ? require("../../../../../assets/icon.png")
                  : { uri: person.profilePhotoUrl }
              }
              style={{
                width: 108,
                height: 108,
                borderRadius: 64,
              }}
              resizeMode="contain"
            />
          </View>
          {/* Name and Status */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>
              {person.name}
            </Text>
            <Text
              style={{
                color: Colors.bottleGreen,
                fontSize: 20,
                fontWeight: "200",
              }}
            >
              {person.status}
            </Text>
          </View>

          {person.isTF ? (
            helpR ? (
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Loading />
                <Text
                  style={{ color: Colors.lavenderBlue, textAlign: "center" }}
                >
                  Requesting for help...
                </Text>
              </View>
            ) : (
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  // tag: "",
                }}
                validationSchema={RequestHelp}
                onSubmit={(values) => requestHelp(values)}
              >
                {(props) => (
                  <View>
                    {requested ? (
                      <>
                        {/* Title Input */}
                        <View>
                          <Input
                            placeholder="Title"
                            value={props.values.title}
                            onChangeText={props.handleChange("title")}
                            inputContainerStyle={{
                              borderBottomWidth: 0,
                            }}
                            errorMessage={props.errors.title}
                            style={{
                              color: Colors.eggshell,
                              padding: 10,
                              borderBottomColor: Colors.eggshell,
                              borderBottomWidth: 1,
                            }}
                          />
                        </View>
                        {/* Description Input */}
                        <View>
                          <Input
                            placeholder="Description"
                            value={props.values.description}
                            onChangeText={props.handleChange("description")}
                            errorMessage={props.errors.description}
                            inputContainerStyle={{
                              borderBottomWidth: 0,
                            }}
                            style={{
                              color: Colors.eggshell,
                              padding: 10,
                              borderBottomColor: Colors.eggshell,
                              borderBottomWidth: 1,
                            }}
                            multiline={true}
                          />
                          {/* Tag */}
                        </View>
                      </>
                    ) : null}
                    {/* Options */}
                    {loading ? (
                      <Loading />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          if (!requested) {
                            setRequested(true);
                          } else {
                            props.handleSubmit();
                          }
                        }}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center",
                          marginBottom: 20,
                          backgroundColor: Colors.darkByzantium,
                          padding: 10,
                          borderRadius: 10,
                          width: "50%",
                        }}
                      >
                        {/* Options */}
                        {requested ? (
                          <Feather
                            name="help-circle"
                            size={20}
                            color={Colors.eggshell}
                          />
                        ) : null}
                        <Text
                          style={{
                            color: Colors.eggshell,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            textAlign: "center",
                            textAlignVertical: "center",
                          }}
                        >
                          {requested ? "Request Help" : "Need Help?"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Formik>
            )
          ) : (
            <View
              style={{
                flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                marginTop: 20,
                marginBottom: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  marginBottom: 5,
                  fontWeight: "bold",
                }}
              >
                Title:{" "}
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 20,
                    marginBottom: 5,
                    fontWeight: "normal",
                  }}
                >
                  {data.title}
                </Text>
              </Text>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  marginBottom: 5,
                  fontWeight: "bold",
                }}
              >
                Description:{" "}
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 20,
                    marginBottom: 5,
                    fontWeight: "normal",
                  }}
                >
                  {data.description}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();

                  const sharedUID = `${User.uid}-${person.uid}`;

                  // Set Status to in progress
                  Firebase.App.setStatus(sharedUID, "In Progress");

                  navigation.navigate("Message", {
                    person,
                    data,
                  });
                  // Close modal
                  // navigation.goBack();
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  marginVertical: 20,
                  backgroundColor: Colors.darkByzantium,
                  padding: 10,
                  borderRadius: 10,
                  width: "50%",
                }}
              >
                {/* Options */}

                {/* <Feather name="help-circle" size={20} color={Colors.eggshell} /> */}

                <Text
                  style={{
                    color: Colors.eggshell,
                    fontSize: 20,
                    fontWeight: "bold",
                    marginHorizontal: 10,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                >
                  Chat with {fName}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Divider */}
          <Divider />
        </View>

        <View
          style={{
            flex: 1,
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          {/* Courses */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              // alignItems: "flex-start",
              // marginHorizontal: 10,
              marginVertical: 20,
            }}
          >
            {/* Courses */}
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              Courses
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {person.tags.map((course, index) => (
                <Delimitated key={index} tag={course} />
              ))}
            </View>
          </View>

          {/* Stats */}
          {person.isTF ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // marginHorizontal: 10,
                marginVertical: 20,
              }}
            >
              {/* Stats */}
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Stats
              </Text>
              {/* Stats  */}
              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  Total Helped: {person.totalHelped}
                </Text>
              </View>

              {/* Rating */}
              {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginVertical: 10,
              }}
            >
              <StarRating rating={4} />
            </View> */}
            </View>
          ) : null}
        </View>

        {/* Close */}
        <View>
          {/* Close */}
          <Button title="Close" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Person;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d",
  },
});
