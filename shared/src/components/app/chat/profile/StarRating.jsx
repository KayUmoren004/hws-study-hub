import React from "react";
import { View } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = Math.ceil(rating - fullStars);
  const emptyStars = 5 - fullStars - halfStars;

  const renderStar = (type) => {
    if (type === "full") {
      return <Icon name="star" size={25} color="#f6b93b" />;
    } else if (type === "half") {
      return <Icon name="star-half" size={25} color="#f6b93b" />;
    } else {
      return <Icon name="star-outline" size={25} color="#f6b93b" />;
    }
  };

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(renderStar("full"));
  }

  if (halfStars) {
    stars.push(renderStar("half"));
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(renderStar("empty"));
  }

  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((star, index) => (
        <View key={index}>{star}</View>
      ))}
    </View>
  );
};

export default StarRating;
