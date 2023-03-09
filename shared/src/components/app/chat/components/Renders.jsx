import { Text } from "react-native";
import { Message } from "react-native-gifted-chat";

// Message
const CustomMessage = (props) => {
  const { currentMessage } = props;

  return (
    <Message {...props}>
      <Text>{currentMessage.message}</Text>
    </Message>
  );
};

export { CustomMessage };
