/**
 * Bundled short feedback tones for graded answers (wired to Settings → Sound effects).
 */
export const ANSWER_FEEDBACK_SOUNDS = {
  correct: require("../../assets/sounds/correct.mp3"),
  incorrect: require("../../assets/sounds/wrong.mp3"),
} as const;

export type AnswerFeedbackSoundKind = keyof typeof ANSWER_FEEDBACK_SOUNDS;
