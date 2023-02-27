import { Feather } from "@expo/vector-icons";
import React from "react";

// Dependencies
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-paper";
import Colors from "../../../../utils/Colors";
import Delimitated from "../../Tag/Delimitated";
import StarRating from "./StarRating";

const courses = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Psychology",
];

const Person = ({ person, navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
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
                  : { uri: person.photo }
              }
              style={{
                width: 128,
                height: 128,
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

          {/* Options */}
          <TouchableOpacity
            onPress={() => console.log("RequestHelp")}
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
            <Feather name="help-circle" size={20} color={Colors.eggshell} />
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
              Request Help
            </Text>
          </TouchableOpacity>
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
              {person.courses.map((course, index) => (
                <Delimitated key={index} tag={course} />
              ))}
            </View>
          </View>

          {/* Stats */}
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
    backgroundColor: "#000",
  },
});
