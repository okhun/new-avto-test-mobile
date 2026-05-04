import {
  ANSWER_FEEDBACK_SOUNDS,
  type AnswerFeedbackSoundKind,
} from "@/src/constants/answerSounds";
import { Audio } from "expo-av";

let audioModeConfigured = false;

async function ensurePlaybackMode(): Promise<void> {
  if (audioModeConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    audioModeConfigured = true;
  } catch {
    /* silent — exam flow must continue */
  }
}

/**
 * Plays a bundled correct/incorrect cue. Safe to fire-and-forget; errors are swallowed.
 */
export async function playAnswerFeedbackSound(
  kind: AnswerFeedbackSoundKind
): Promise<void> {
  try {
    await ensurePlaybackMode();
    const { sound } = await Audio.Sound.createAsync(
      ANSWER_FEEDBACK_SOUNDS[kind],
      { shouldPlay: true, volume: 1 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch {
    /* ignore playback failures */
  }
}
