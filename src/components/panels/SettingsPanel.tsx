import React, {useState} from "react";
import Alert from "../Alert.tsx";
import CreditsSection from "../CreditsSection.tsx";
import {FaVolumeDown, FaVolumeUp} from "react-icons/fa";

interface SettingsPanelProps {
    isMuted: boolean;
    volume: number;
    formatPlaytime: (time: number) => string;
    totalPlaytime: number;
    onToggleMute: () => void;
    onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onResetGame: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                         isMuted,
                                                         volume,
                                                         formatPlaytime,
                                                         totalPlaytime,
                                                         onToggleMute,
                                                         onVolumeChange,
                                                         onResetGame,
                                                     }) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false); // State for managing alert visibility
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
            <div className="flex items-center mt-4 font-bold">
                <label className="mr-3 text-base md:text-2xl ">Mute:</label>
                <button
                    onClick={onToggleMute}
                    className={`px-4 py-2 rounded bg-${isMuted ? 'red' : 'green'}-500 text-white`}
                >
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
            </div>

            {/* Volume Slider */}
            <div className="mt-6">
                <label className="block text-base md:text-2xl mb-2 font-bold">Volume:</label>
                <div className="flex items-center gap-3">

                    <FaVolumeDown className={`ml-2`} size={36}/>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={onVolumeChange}
                        className="w-full h-4 mx-2 rounded-lg appearance-none bg-gray-300 outline-none
                            transition-all duration-200 hover:bg-gray-400 focus:ring focus:ring-blue-300"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgb(33, 150, 243) 0%, rgb(33, 150, 243) " +
                                volume * 100 +
                                "%, rgb(229, 231, 235) " +
                                volume * 100 +
                                "%)",
                        }}
                    />

                    <FaVolumeUp className={`mr-2`} size={48} />

                </div>
            </div>
            <div className={`border w-4/5 mx-auto mt-3 bg-gray-300 rounded-lg opacity-75`}>
            {/* Playtime Section */}
            <div className="text-center mt-4">
                <p className="text-black text-2xl font-bold">Total Playtime:</p>
                <p className="text-black text-xl">{formatPlaytime(totalPlaytime)}</p>
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