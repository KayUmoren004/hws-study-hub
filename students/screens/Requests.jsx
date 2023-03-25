import React, { useContext, useEffect, useState } from "react";

// Dependencies
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";

import FirebaseConfig from "../../shared/src/helpers/config/FirebaseConfig";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { UserContext } from "../../shared/src/helpers/UserContext";

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);

// const Item = ({ data }) => {
//   const date = data.createdAt.toDate().toString().slice(0, 15);
//   const time = data.createdAt.toDate().toString().slice(16, 21);

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <View
//         style={{
//           flexDirection: "column",
//         }}
//       >
//         <Text
//           style={{
//             color: "#fff",
//           }}
//         >
//           {data.title}
//         </Text>
//         <Text
//           style={{
//             color: "#fff",
//           }}
//         >
//           {data.description}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: "column",
//           alignItems: "flex-end",
//         }}
//       >
//         <Text
//           style={{
//             color: "#fff",
//           }}
//         >
//           {data.tf.name}
//         </Text>
//         <Text
//           style={{
//             color: "#fff",
//           }}
//         >
//           {data.status}
//         </Text>
//         <Text
//           style={{
//             color: "#fff",
//           }}
//         >
//           {date}
//         </Text>
//       </View>
//     </View>
//   );
// };

const Item = ({ data }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "#2c3e50",
        padding: 16,
        width: "100%",
        borderRadius: 8,
      }}
    >
      <View>
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {data.title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row", // Changed from "column" to "row"
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            // marginRight: 16, // Added marginRight for spacing between tf.name and status
          }}
        >
          {data.tf.name}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
          }}
        >
          {" "}
          |{" "}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
          }}
        >
          {data.status}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
          }}
        >
          {" "}
          |{" "}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
          }}
        >
          {data.createdAt.toDate().toString().slice(3, 15)}
        </Text>
      </View>
    </View>
  );
};

const Requests = ({ navigation }) => {
  // State
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Context
  const [User] = useContext(UserContext);

  // On Mount Get Requests
  useEffect(() => {
    // Get User Requests
    const collectionRef = collection(db, "users", User.uid, "requests");

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRequests(data);
      setLoading(false); // Set loading to false after data is fetched
    });

    return unsubscribe;
  }, []);

  // console.log(requests);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 16,
              color: "#fff",
            }}
          >
            My Requests
          </Text>
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <FlatList
            data={requests}
            renderItem={({ item }) => (
              <View
                style={
                  {
                    // marginVertical: 8,
                    // marginHorizontal: 16,
                  }
                }
              >
                <Item data={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <View>
        <Button title="Close" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default Requests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
