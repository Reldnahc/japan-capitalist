import React, {useState} from "react";
import Alert from "../Alert.tsx";
import CreditsSection from "../CreditsSection.tsx";
import VolumeSlider from "../VolumeSlider.tsx";

interface AudioSettings {
    isMuted: boolean;
    volumes: { music: number; soundEffects: number };
    onToggleMute: () => void;
    onUpdateVolume: (type: 'music' | 'soundEffects') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}


interface SettingsPanelProps {
    audioSettings: AudioSettings;
    formatPlaytime: (seconds: number) => string;
    totalPlaytime: number;
    onResetGame: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ audioSettings, formatPlaytime, totalPlaytime, onResetGame}) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false); // State for managing alert visibility
    const { isMuted, volumes, onToggleMute, onUpdateVolume } = audioSettings;

    const handleResetGameClick = () => {
        setIsAlertOpen(true); // Open the alert when the Reset Game button is pressed
    };

    const handleConfirmReset = () => {
        onResetGame(); // Execute onResetGame action
        setIsAlertOpen(false); // Close the alert
    };

    const handleCancelReset = () => {
        setIsAlertOpen(false); // Dismiss the alert without taking action
    };

    return (
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-3 pb-8">


            {/* Mute Button */}
            <div className="flex items-center ml-2 mt-4 font-bold">
                <label className="mr-3 text-base md:text-2xl text-gray-100 ">Mute:</label>
                <button
                    onClick={onToggleMute}
                    className={`px-4 py-2 rounded bg-${isMuted ? 'red' : 'green'}-500 text-white`}
                >
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
            </div>

            {/* Volume Slider */}
            <VolumeSlider
                label="Music Volume:"
                volume={volumes.music}
                onVolumeChange={onUpdateVolume('music')}
            />

            {/* Effects Volume Slider */}
            <VolumeSlider
                label="Effects Volume:"
                volume={volumes.soundEffects}
                onVolumeChange={onUpdateVolume('soundEffects')}
            />

            <div className={`w-4/5 mx-auto border-gray-500 border-2 rounded-lg p-4 mt-4 bg-gray-800 bg-opacity-80`}>
            {/* Playtime Section */}
            <div className="text-center mt-4">
                <p className="text-white text-2xl font-bold">Total Playtime:</p>
                <p className="text-white text-xl">{formatPlaytime(totalPlaytime)}</p>
            </div>

            {/* Credits Section */}
            <CreditsSection/>
        </div>
            {/* Reset Game Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleResetGameClick}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Reset Game
                </button>
            </div>
            <Alert
                isOpen={isAlertOpen}
                text={
                    <div>
                        <strong>Warning:</strong> Are you sure you want to reset the game? <br />
                        <span className="text-red-600">This action will delete all progress and cannot be undone.</span>
                    </div>
                }
                buttons={[
                    {
                        label: "Cancel", // Dismiss button text
                        onClick: handleCancelReset, // Dismiss action
                        styleClass: "bg-gray-500 text-white hover:bg-gray-600",
                    },
                    {
                        label: "Confirm", // Confirm button text
                        onClick: handleConfirmReset, // Confirm action
                        styleClass: "bg-red-500 text-white hover:bg-red-600",
                    },
                ]}
                closeAlert={() => setIsAlertOpen(false)} // Close the alert when dismissed
            />
    </div>
    );
};

export default SettingsPanel;