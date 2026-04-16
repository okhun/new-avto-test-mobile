import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKGROUND_LIGHT = "#f6f7f8";
export default function ConversationsScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, eos fuga
        sint corporis exercitationem molestias rem temporibus sequi illum
        aliquid fugiat? Nobis deleniti voluptates nisi, nemo explicabo labore a
        unde!
      </Text>
    </SafeAreaView>
  );
}
