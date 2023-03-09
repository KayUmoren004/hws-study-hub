import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

// Dependencies
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  arrayRemove,
  serverTimestamp,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import FirebaseConfig from "../../shared/src/helpers/config/FirebaseConfig";
import { UserContext } from "../../shared/src/helpers/UserContext";
import { Feather } from "@expo/vector-icons";
import StudentView from "../../shared/src/components/app/StudentView";
import Colors from "../../shared/src/utils/Colors";
import Status from "../../shared/src/components/app/picker/Status";
const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);

const s = ["Open", "Pending", "In Progress", "Completed"];

const Home = ({ navigation }) => {
  // State
  const [requestForHelp, setRequestForHelp] = useState({
    open: null,
    pending: null,
    inProgress: null,
    completed: null,
  });
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Open");
  const [pick, setPick] = useState(s[0]);
  const [pickerSeen, setPickerSeen] = useState(false);
  // Context
  const [User] = useContext(UserContext);

  // Listen for changes in "requestForHelp" collection in firestore where tfUID === User.uid
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "requestForHelp"),
      (querySnapshot) => {
        let openArr = [];
        let pendingArr = [];
        let inProgressArr = [];
        let completedArr = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().tfUID === User.uid) {
            if (doc.data().status === "Open") {
              openArr.push(doc.data());
            } else if (doc.data().status === "Pending") {
              pendingArr.push(doc.data());
            } else if (doc.data().status === "In Progress") {
              inProgressArr.push(doc.data());
            } else if (doc.data().status === "Completed") {
              completedArr.push(doc.data());
            }
          }
        });
        setRequestForHelp({
          open: openArr,
          pending: pendingArr,
          inProgress: inProgressArr,
          completed: completedArr,
        });
        setData(openArr);
      }
    );
    return unsubscribe;
  }, []);

  // Add Functionality to header buttons on mount
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => navigation.navigate("Tags")}
          >
            <Feather name="plus" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              setPickerSeen(true);
            }}
          >
            <Feather name="filter" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  // Sort the array by status
  const sort = (pick) => {
    setPickerSeen(false);
    if (requestForHelp) {
      // Based on pick, set data to the corresponding array
      if (pick === "Open") {
        setData(requestForHelp.open);
      }
      if (pick === "Pending") {
        setData(requestForHelp.pending);
      }
      if (pick === "In Progress") {
        setData(requestForHelp.inProgress);
      }
      if (pick === "Completed") {
        setData(requestForHelp.completed);
      }

      // Set status to the corresponding status
      if (pick === "Open") {
        setStatus("Open");
      }
      if (pick === "Pending") {
        setStatus("Pending");
      }
      if (pick === "In Progress") {
        setStatus("In Progress");
      }
      if (pick === "Completed") {
        setStatus("Completed");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          // borderTopWidth: 1,
          // borderBottomWidth: 1,
          borderColor: "#fff",
        }}
      >
        {/* Status */}
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "200",
          }}
        >
          Status:{" "}
          <Text
            style={{
              color:
                status === "Open"
                  ? Colors.lavenderBlue
                  : status === "Pending"
                  ? Colors.yellow
                  : status === "In Progress"
                  ? Colors.orange
                  : status === "Completed"
                  ? Colors.bottleGreen
                  : "#fff",
              fontSize: 20,
              fontWeight: "200",
            }}
          >
            {status}
          </Text>
        </Text>
      </View>
      {/* Body */}
      <View style={{ flex: 1 }}>
        {/* Picker */}
        <Modal
          animationType="slide"
          visible={pickerSeen}
          transparent={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setPickerSeen(!pickerSeen);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Status
              selectedValue={pick}
              setPick={setPick}
              onClose={() => {
                sort(pick);
              }}
              status={s}
            />
          </View>
        </Modal>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <StudentView
              Student={item.requestor}
              navigation={navigation}
              data={item}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 4,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
