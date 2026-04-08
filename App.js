import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Vibration,
  StatusBar,
} from "react-native";

// Configuración de modos
const MODES = {
  DC: { label: "DC", duration: 5 * 60, color: "#4CAF50" }, // Verde
  DM: { label: "DM", duration: 10 * 60, color: "#FFC107" }, // Amarillo
  PM: { label: "PM", duration: 25 * 60, color: "#F44336" }, // Rojo
};

export default function App() {
  const [mode, setMode] = useState("PM");
  const [timeLeft, setTimeLeft] = useState(MODES.PM.duration);
  const [isRunning, setIsRunning] = useState(false);

  // Manejar cambio de modo (DC, DM, PM)
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  // Lógica del temporizador
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

  // Iniciar temporizador
  const handleStart = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  };

  // Detener/Reiniciar temporizador
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  // Alarma al finalizar
  const triggerAlarm = () => {
    Vibration.vibrate([500, 200, 500]); // Vibración en patrón
    Alert.alert(
      "⏰ ¡Tiempo!",
      "El temporizador ha terminado. Es hora de cambiar de actividad.",
    );
  };

  // Formato MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: MODES[mode].color }]}>
      <StatusBar barStyle="dark-content" />

      {/* Título dentro de rectángulo */}
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>Pomorrodo</Text>
      </View>

      {/* Botones de modo (DC, DM, PM) */}
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

      {/* Temporizador cuadrado */}
      <View style={styles.timerSquare}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* Botón Iniciar (ligeramente más grande) */}
      <TouchableOpacity
        style={[styles.ctrlBtn, styles.startBtn]}
        onPress={handleStart}
      >
        <Text style={styles.ctrlText}>Iniciar</Text>
      </TouchableOpacity>

      {/* Botón Parar (mismo tamaño que Iniciar) */}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 1,
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 12,
  },
  modeBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 12,
  },
  timerText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#111",
    fontVariant: ["tabular-nums"], // Evita que los números "salten" al cambiar
  },
  ctrlBtn: {
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  startBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    width: "85%",
  },
  stopBtn: {
    backgroundColor: "#757575",
    paddingVertical: 16,
    width: "85%",
    marginTop: 4,
  },
  ctrlText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
