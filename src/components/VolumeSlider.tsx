import React from "react";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";

interface VolumeSliderProps {
    label: string;
    volume: number;
    onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ label, volume, onVolumeChange }) => {
    return (
        <div className="mt-6">
            {/* Volume Label */}
            <label className="block text-base md:text-2xl mb-2 ml-2 text-gray-100 font-bold">{label}</label>
            <div className="flex items-center gap-3">
                {/* Volume Down Icon */}
                <FaVolumeDown className="ml-2" size={36} />
                
                {/* Slider */}
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
                        backgroundImage: `linear-gradient(90deg, rgb(33, 150, 243) 0%, 
                            rgb(33, 150, 243) ${volume * 100}%, 
                            rgb(229, 231, 235) ${volume * 100}%)`,
                    }}
                />

                {/* Volume Up Icon */}
                <FaVolumeUp className="mr-2" size={48} />
            </div>
        </div>
    );
};

export default VolumeSlider;