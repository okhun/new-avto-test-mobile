import { Dimensions } from "react-native";

export const COLORS = {
  PRIMARY: "#137fec",
  BG: "#f6f7f8",
  TEXT_DARK: "#0d141b",
  CARD_BG: "#ffffff",
  SUCCESS: "#22c55e",
  ERROR: "#ef4444",
} as const;

export const SPRING_CONFIG = { damping: 15, stiffness: 400 } as const;

export const SCREEN_WIDTH = Dimensions.get("window").width;

export const QUESTION_BTN_SIZE = 40;
export const QUESTION_BTN_GAP = 8;
export const ANSWER_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const FEEDBACK_DELAY_MS = 1200;
