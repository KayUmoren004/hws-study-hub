// TODO: Change courses to a picker for tags in profile

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Input } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import { CourseSchema } from "../../utils/Validation";

import Button from "./Button";
import Colors from "../../utils/Colors";
import Container from "../auth/Container";

import { FirebaseContext } from "../../../shared/src/helpers/helpers/FirebaseContext";
import { useState, useContext } from "react";

const Course = ({ navigation }) => {
  // State
  const [loading, setLoading] = useState(false);

  // Context
  const Firebase = useContext(FirebaseContext);

  // Submit Course
  const submitCourse = async (val) => {
    setLoading(true);
    try {
      const submitted = await Firebase.addCourse(val);

      if (submitted) {
        navigation.goBack();
      }
    } catch (err) {
      console.log("Error @Course.submitCourse: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading Component
  const Loading = () => {
    return (
      <View>
        <ActivityIndicator size={"large"} color={Colors.languidLavender} />
      </View>
    );
  };

  return (
    <Container style={Styles.container}>
      {/* Header */}
      <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={40}
            style={{
              borderColor: Colors.eggshell,
              marginRight: 10,
              borderRadius: 10,
              borderWidth: 2,
              color: Colors.lavenderBlue,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Add a Course
        </Text>
      </View>
      {/* Body */}
      <View style={{ padding: 10, flex: 1 }}>
        <Formik
          initialValues={{
            title: "",
            code: "",
            instructor: "",
          }}
          validationSchema={CourseSchema}
          onSubmit={(values) => {
            submitCourse(values);
          }}
        >
          {(props) => (
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}
            >
              <View>
                {/* Course Name */}
                <Input
                  placeholder="Course Title (e.g. Introduction to Programming)"
                  onChangeText={props.handleChange("title")}
                  value={props.values.title}
                  onSubmitEditing={props.handleSubmit}
                  inputStyle={{
                    color: Colors.white,
                    fontSize: 17,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                  }}
                  errorMessage={props.errors.title}
                  autoCapitalize="words"
                  containerStyle={{
                    marginVertical: 10,
                  }}
                />
                {/* Spacer */}
                <View style={{ height: 10 }} />
                {/* Course Code */}
                <Input
                  placeholder="Course Code with Section (e.g. CPSC-124-01)"
                  onChangeText={props.handleChange("code")}
                  value={props.values.code}
                  onSubmitEditing={props.handleSubmit}
                  inputStyle={{
                    color: Colors.white,
                    fontSize: 17,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                  }}
                  errorMessage={props.errors.code}
                  autoCapitalize="characters"
                  containerStyle={{
                    marginVertical: 10,
                  }}
                />
                {/* Spacer */}
                <View style={{ height: 10 }} />

                {/* Course Instructor */}
                <Input
                  placeholder="Instructor (e.g. John Doe)"
                  onChangeText={props.handleChange("instructor")}
                  value={props.values.instructor}
                  onSubmitEditing={props.handleSubmit}
                  inputStyle={{
                    color: Colors.white,
                    fontSize: 17,
                  }}
                  inputContainerStyle={{
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                  }}
                  errorMessage={props.errors.instructor}
                  autoComplete="name"
                  autoCapitalize="words"
                  containerStyle={{
                    marginVertical: 10,
                  }}
                />
              </View>
              {/* Spacer */}
              <View style={{ height: 10 }} />
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                {/* Submit */}
                {loading && <Loading />}
                {!loading && (
                  <Button onPress={props.handleSubmit} label="Submit" />
                )}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Container>
  );
};

export default Course;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
