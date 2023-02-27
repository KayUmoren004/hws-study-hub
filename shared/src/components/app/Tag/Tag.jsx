// // TODO: Fix Tag selection issue

// import { Feather } from "@expo/vector-icons";
// import React, { useContext } from "react";

// // Dependencies
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Colors from "../../../utils/Colors";
// import { UserContext } from "../../../helpers/UserContext";
// import { FirebaseContext } from "../../../helpers/FirebaseContext";

// const Tag = ({ tag, tagsSelected, setTagSelected, cloudTags }) => {
//   // Context
//   const [User] = useContext(UserContext);
//   const Firebase = useContext(FirebaseContext);
//   const [clickCounter, setClickCounter] = React.useState(0);

//   //console.log("Tag.jsx: ", tagsSelected);

//   // Check if tag is in tagsSelected
//   const isTagSelected = cloudTags.includes(tag) || tagsSelected.includes(tag);

//   // Change color if tag is in tagsSelected
//   // const backgroundColor = () => {
//   //   if (clickCounter % 2 === 0) {
//   //     return Colors.black;
//   //   }

//   //   if (isTagSelected || cloudTags.includes(tag)) {
//   //     return Colors.bottleGreen;
//   //   } else {
//   //     return Colors.black;
//   //   }
//   // };

//   // If cloudTags.length > 0, then set clickCounter to 1 on mount
//   React.useEffect(() => {
//     if (cloudTags.length > 0) {
//       setClickCounter(1);
//     }
//   }, [cloudTags]);

//   const backgroundColor =
//     isTagSelected && clickCounter % 2 === 0 ? Colors.bottleGreen : Colors.black;

//   // Remove all occurrences
//   const rAll = (arr, tag) => {
//     var i = 0;
//     while (i < arr.length) {
//       if (arr[i] === tag) {
//         arr.splice(i, 1);
//       } else {
//         ++i;
//       }
//     }
//     return arr;
//   };

//   return (
//     <View
//       style={{
//         padding: 5,
//       }}
//     >
//       <TouchableOpacity
//         style={[styles.container, { backgroundColor: backgroundColor }]}
//         onPress={() => {
//           setClickCounter((prevCounter) => prevCounter + 1);
//           // If tag is already selected, remove it from tagsSelected
//           // Else, add it to tagsSelected
//           if (isTagSelected) {
//             const deleted = Firebase.deleteTag(tag);
//             setTagSelected(rAll(tagsSelected, tag));

//             if (deleted) {
//               console.log("Tag.jsx: Tag deleted");
//             } else {
//               console.log("Tag.jsx: Tag not deleted");
//             }
//           } else {
//             setTagSelected([...tagsSelected, tag]);
//           }
//         }}
//       >
//         <Text
//           style={{
//             color: "#fff",
//             textAlign: "Justify",
//             fontWeight: isTagSelected ? "bold" : "normal",
//           }}
//         >
//           {tag}
//         </Text>
//         <Feather
//           name="check-circle"
//           color={Colors.white}
//           size={20}
//           style={{
//             opacity: isTagSelected ? 1 : 0,
//           }}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Tag;

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // backgroundColor: Colors.darkByzantium,
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
// });

import { Feather } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../utils/Colors";
import { UserContext } from "../../../../shared/src/helpers/helpers/UserContext";
import { FirebaseContext } from "../../../../shared/src/helpers/helpers/FirebaseContext";

const Tag = ({
  tag,
  cloudTags,
  selectedTags,
  setSelectedTags,
  setCloudTags,
}) => {
  const [isTagSelected, setIsTagSelected] = React.useState(false);

  const [User] = useContext(UserContext);
  const Firebase = useContext(FirebaseContext);

  const backgroundColor =
    isTagSelected || cloudTags.includes(tag)
      ? Colors.bottleGreen
      : Colors.black;

  const opacity = isTagSelected || cloudTags.includes(tag) ? 1 : 0;
  const fontWeight =
    isTagSelected || cloudTags.includes(tag) ? "bold" : "normal";

  const onPress = async () => {
    setIsTagSelected(!isTagSelected);

    if (
      (isTagSelected && !cloudTags.includes(tag)) ||
      (isTagSelected && !selectedTags.includes(tag))
    ) {
      setSelectedTags([...selectedTags, tag]);
    }

    // else {
    //   setSelectedTags(selectedTags.filter((t) => t !== tag));
    // }
  };

  const onPressOut = async () => {
    if (cloudTags.includes(tag) && isTagSelected) {
      setIsTagSelected(false);
      const deleted = await Firebase.deleteTag(tag);

      if (deleted) {
        console.log("Tag.jsx: Tag deleted");
      } else {
        console.log("Tag.jsx: Tag not deleted");
      }

      setSelectedTags(selectedTags.filter((t) => t !== tag));

      // Refresh to see changes
      const refresh = await Firebase.refreshTags();

      if (refresh) {
        // Set cloudTags to new tags
        setCloudTags(refresh);
      }
    }
  };

  return (
    <View style={{ padding: 5 }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor }]}
        onPress={() => {
          setIsTagSelected(!isTagSelected);

          if (
            (isTagSelected && !cloudTags.includes(tag)) ||
            (isTagSelected && !selectedTags.includes(tag))
          ) {
            setSelectedTags([...selectedTags, tag]);
          }
        }}
        onPressOut={async () => {
          if (cloudTags.includes(tag) && isTagSelected) {
            setIsTagSelected(false);
            const deleted = await Firebase.deleteTag(tag);

            if (deleted) {
              console.log("Tag.jsx: Tag deleted");
            } else {
              console.log("Tag.jsx: Tag not deleted");
            }

            setSelectedTags(selectedTags.filter((t) => t !== tag));

            // Refresh to see changes
            const refresh = await Firebase.refreshTags();

            if (refresh) {
              // Set cloudTags to new tags

              setCloudTags(refresh);
            }
          }
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "Justify",
            fontWeight,
          }}
        >
          {tag}
        </Text>
        <Feather
          name="check-circle"
          color={Colors.white}
          size={20}
          style={{
            opacity,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
