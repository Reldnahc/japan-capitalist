import React, {createContext, useContext, useEffect, useState} from "react";
import { AudioManager } from "../utils/audioManager"; // Import your AudioManager class
import background from '../assets/sounds/background.ogg';
import tack from  '../assets/sounds/tack.ogg';
import cashRegister from  '../assets/sounds/cash-register.ogg';

interface AudioManagerContextType {
  isMuted: boolean;
  volumes: { music: number; soundEffects: number };
  play: (soundKey: string) => void;
  pause: (soundKey: string) => void;
  setVolume: (type: "music" | "soundEffects", volume: number) => void;
  toggleMute: () => void;
}

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error("useAudioManager must be used within an AudioManagerProvider");
  }
  return context;
};

// The provider component
export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States for managing audio
  const [isMuted, setIsMuted] = useState(AudioManager.getMuted());
  const [volumes, setVolumes] = useState<{ music: number; soundEffects: number }>({
    music: AudioManager.getVolume("music"),
    soundEffects: AudioManager.getVolume("soundEffects"),
  });

  useEffect(() => {
    // Centralized sound loading
    AudioManager.loadSounds({
      background: { src: background, type: "music" },
      tack: { src: tack, type: "soundEffects" },
      cashRegister: { src: cashRegister, type: "soundEffects" },
    });

    // Set background music to loop
    AudioManager.audioElements["background"].loop = true;

    // Automatically play background music if not muted
    if (!isMuted) {
      AudioManager.play("background");
    }

    return () => {
      // Pause background music on cleanup
      AudioManager.pause("background");
    };
  }, [isMuted]);

  // Play audio
  const play = (soundKey: string) => {
    AudioManager.play(soundKey);
  };

  // Pause audio
  const pause = (soundKey: string) => {
    AudioManager.pause(soundKey);
  };

  // Set audio volume
  const setVolume = (type: "music" | "soundEffects", volume: number) => {
    AudioManager.setVolume(type, volume); // Update volumes in AudioManager
    setVolumes((prev) => ({ ...prev, [type]: volume })); // Update local state
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    const newMutedState = !isMuted;
    AudioManager.setMuted(newMutedState); // Sync muted state with AudioManager
    setIsMuted(newMutedState); // Update React state
  };

  return (
    <AudioManagerContext.Provider
      value={{
        isMuted,
        volumes,
        play,
        pause,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioManagerContext.Provider>
  );
};