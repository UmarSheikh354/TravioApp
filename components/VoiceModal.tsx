import { Feather } from "@expo/vector-icons";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { PressableScale } from "@/components/PressableScale";
import { colors, spacing } from "@/lib/theme";

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

function WaveBar({ index }: { index: number }) {
  const height = useSharedValue(12);

  useEffect(() => {
    height.value = withRepeat(
      withTiming(40, { duration: 350 + index * 90 }),
      -1,
      true,
    );
  }, [height, index]);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return <Animated.View style={[styles.bar, style]} />;
}

export function VoiceModal({ visible, onClose }: VoiceModalProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted || cancelled) {
          return;
        }
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await recorder.prepareToRecordAsync();
        recorder.record();
      } catch {
        // Microphone unavailable — keep the modal usable for UI only.
      }
    }
    if (visible) {
      start();
    }
    return () => {
      cancelled = true;
    };
  }, [visible, recorder]);

  async function finish() {
    try {
      await recorder.stop();
    } catch {
      // ignore stop errors
    }
    onClose();
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Listening...</Text>

        <View style={styles.waveform}>
          {[0, 1, 2, 3, 4].map((index) => (
            <WaveBar key={index} index={index} />
          ))}
        </View>

        <Text style={styles.hint}>Tap stop when you&apos;re done speaking</Text>

        <View style={styles.controls}>
          <PressableScale
            style={[styles.controlButton, styles.cancelButton]}
            onPress={onClose}
            accessibilityLabel="Cancel voice input"
          >
            <Feather name="x" size={26} color={colors.white} />
          </PressableScale>
          <PressableScale
            style={[styles.controlButton, styles.stopButton]}
            onPress={finish}
            accessibilityLabel="Stop and send"
          >
            <Feather name="check" size={26} color={colors.white} />
          </PressableScale>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
    padding: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.white,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 60,
  },
  bar: {
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  hint: {
    fontSize: 14,
    color: colors.iconMuted,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.xxl,
    marginTop: spacing.xl,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
  stopButton: {
    backgroundColor: colors.accent,
  },
});
