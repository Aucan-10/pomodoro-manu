import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Vibration,
  StatusBar,
} from "react-native";
import { Audio } from "expo-av";

// Configuración de modos
const MODES = {
  DC: { label: "DC", duration: 1, color: "#4CAF50" },
  DM: { label: "DM", duration: 10 * 60, color: "#FFC107" },
  PM: { label: "PM", duration: 25 * 60, color: "#F44336" },
};

export default function App() {
  const [mode, setMode] = useState("PM");
  const [timeLeft, setTimeLeft] = useState(MODES.PM.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState(null);

  // 🔊 CONFIGURACIÓN DE AUDIO (MUY IMPORTANTE)
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true, // 👈 clave para iPhone
      staysActiveInBackground: false,
    });
  }, []);

  // Manejar cambio de modo
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  const handleStart = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  // 🔊 Reproducir sonido
  async function playAlarmSound() {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("./assets/audio/Sirena.mp3")
      );

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log("Error al reproducir sonido:", error);
    }
  }

  // Temporizador
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            triggerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Alarma
  const triggerAlarm = () => {
    Vibration.vibrate([500, 200, 500]);
    playAlarmSound();
    Alert.alert(
      "⏰ ¡Tiempo!",
      "El temporizador ha terminado. Es hora de cambiar de actividad."
    );
  };

  // Limpiar sonido
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Formato tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: MODES[mode].color }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.titleBox}>
        <Text style={styles.titleText}>Pomorolo</Text>
      </View>

      <View style={styles.modeContainer}>
        {Object.keys(MODES).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.modeBtn, mode === key && styles.modeBtnActive]}
            onPress={() => handleModeChange(key)}
          >
            <Text
              style={[styles.modeText, mode === key && styles.modeTextActive]}
            >
              {MODES[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timerSquare}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.ctrlBtn,
          {
            backgroundColor: MODES[mode].color,
            borderColor: "rgba(255, 255, 255, 0.6)",
            borderWidth: 2,
            paddingVertical: 16,
            width: "85%",
          },
        ]}
        onPress={handleStart}
      >
        <Text style={styles.ctrlText}>Iniciar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ctrlBtn, styles.stopBtn]}
        onPress={handleStop}
      >
        <Text style={styles.ctrlText}>Parar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  titleBox: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 10,
    borderRadius: 8,
    minWidth: 65,
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: "#222",
  },
  modeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modeTextActive: {
    color: "#FFF",
  },
  timerSquare: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "700",
  },
  ctrlBtn: {
    borderRadius: 12,
    alignItems: "center",
  },
  stopBtn: {
    backgroundColor: "#757575",
    paddingVertical: 16,
    width: "85%",
  },
  ctrlText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
