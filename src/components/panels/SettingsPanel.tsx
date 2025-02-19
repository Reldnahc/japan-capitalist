import React from "react";

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
    return (
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-3 pb-8">
            {/* Playtime Section */}
            <div className="text-center mt-4">
                <p className="text-black text-2xl font-bold">Total Playtime:</p>
                <p className="text-black text-xl">{formatPlaytime(totalPlaytime)}</p>
            </div>

            {/* Mute Button */}
            <div className="flex items-center mt-4">
                <label className="mr-3 text-sm">Mute:</label>
                <button
                    onClick={onToggleMute}
                    className={`px-4 py-2 rounded bg-${isMuted ? 'red' : 'green'}-500 text-white`}
                >
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
            </div>

            {/* Volume Slider */}
            <div className="mt-6">
                <label className="block text-sm mb-2">Volume:</label>
                <div className="flex items-center gap-3">
                    <span
                        className="text-2xl text-gray-700"
                        role="img"
                        aria-label="Low volume"
                    >
                        🔈
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={onVolumeChange}
                        className="w-full h-4 rounded-lg appearance-none bg-gray-300 outline-none
                            transition-all duration-200 hover:bg-gray-400 focus:ring focus:ring-purple-300"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgb(156, 39, 176) 0%, rgb(156, 39, 176) " +
                                volume * 100 +
                                "%, rgb(229, 231, 235) " +
                                volume * 100 +
                                "%)",
                        }}
                    />
                    <span
                        className="text-2xl text-gray-700"
                        role="img"
                        aria-label="High volume"
                    >
                        🔊
                    </span>
                </div>
            </div>


            {/* Credits Section */}
            <div className="text-center mt-4">
                <p className="text-black text-5xl">Credits:</p>
                <p className="text-black text-2xl font-bold">Development:</p>
                <p className="text-black text-xl">Chandler</p>
                <p className="text-black text-2xl font-bold">Playtesting:</p>
                <p className="text-black text-xl mb-3">Victor, Despot, Danielle, Logan, Aaron</p>
                <p className="text-black text-xl mb-3">Cash Register by kiddpark -- https://freesound.org/s/201159/ -- License: Attribution 4.0</p>
            </div>

            {/* Reset Game Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={onResetGame}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Reset Game
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;