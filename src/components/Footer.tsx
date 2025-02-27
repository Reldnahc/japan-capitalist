import React, { useState, useEffect } from "react";
import {formatDecimalWithSuffix} from "../utils/formatNumber.ts";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import {useAudioManager} from "../contexts/AudioManagerProvider.tsx";
import Decimal from "break_infinity.js"; // Import icons

// Define Footer props
interface FooterProps {
    currency: Decimal;
    silver: Decimal
    purchaseAmount: string;
    onOpenPanel: (panelName: string) => void;
    onPurchaseAmountChange: (amount: string) => void;
    onStartProductionForBusiness: () => void;
    readyBusinessesCount: number;
}

const Footer: React.FC<FooterProps> = ({ currency, silver, purchaseAmount, onOpenPanel, onPurchaseAmountChange,
                                           onStartProductionForBusiness, readyBusinessesCount }) => {
    // State to handle menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const purchaseOptions = ["x1", "x5", "x10", "x100", "next", "max"];
    const { isMuted, toggleMute, play } = useAudioManager();

    // Scroll locking logic
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
        } else {
            document.body.style.overflow = ""; // Re-enable scrolling
        }

        // Cleanup to ensure scrolling is re-enabled when component unmounts
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    const cyclePurchaseAmount = () => {
        play('tack');
        const currentIndex = purchaseOptions.indexOf(purchaseAmount);
        const nextIndex = (currentIndex + 1) % purchaseOptions.length; // Cycle through options
        const nextAmount = purchaseOptions[nextIndex];
        onPurchaseAmountChange(nextAmount); // Notify parent component (Game) of change
    };

    const money = formatDecimalWithSuffix(currency).split(" ");
    return (
        <div className="font-fredoka">
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={() => setIsMenuOpen(false)} // Close the menu when clicking the overlay
                ></div>
            )}

            <footer className="fixed bottom-0 inset-x-0 max-w-xl mx-auto bg-gray-700 text-white py-2 opacity-95 z-50">
                <div className="ml-3 flex flex-col space-y-2 mb-2 text-xs md:text-base">
                    {/* Silver section with mute button moved to the right */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                            <img
                                src="/japan-capitalist/images/silver.webp" // Replace with the actual path to your image
                                alt="Silver Icon"
                                className="h-4 w-4 md:h-6 md:w-6" // Tailwind classes for sizing
                            />
                            <span>{silver.toString()}</span>
                        </div>
                        <button
                            onClick={toggleMute}
                            className="text-white text-xl md:text-2xl mr-3 hover:text-yellow-400 transition"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                    </div>

                    {/* Dividing line */}
                    <div className="w-full -ml-1.5 h-px bg-gray-400 opacity-50"></div>
                </div>


                <div className="container mx-auto max-w-xl flex items-center px-4 justify-between">
                    {/* Currency on the left */}
                    <div className="text-4xl md:text-7xl mr-3">¥</div>

                    { money[1] ? (
                        <div className="flex items-center">
                            <div className="md:text-2xl leading-tight">
                                {money[0]} <br/> {money[1]}
                            </div>
                        </div>
                    ) : (

                        <div className="text-md md:text-3xl">
                            {money}
                        </div>


                    )}

                    {/* Hamburger menu in the center */}
                    <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 items-center space-x-4">
                        <div className="relative">
                            {isMenuOpen && (
                                <div className="absolute bottom-10 md:bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white w-56 md:w-96 text-2xl md:text-5xl rounded-lg shadow-lg z-50">
                                    <ul className="flex flex-col py-2">
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Items & Effects");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Items & Effects
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Unlocks");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Unlocks
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Managers");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Managers
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Fans");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Fans
                                            </button>
                                        </li>
                                        <li>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                            onClick={() => {
                                                onOpenPanel("Gallery");
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Gallery
                                        </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Login Rewards");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Login Rewards
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    onOpenPanel("Settings");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Settings
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            className="flex flex-col items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-gray-600 rounded-md hover:bg-gray-500 transition"
                            aria-label="Menu"
                            onClick={() => {
                                play('tack');
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            {/* Hamburger menu lines */}
                            <span className="block w-6 h-0.5 md:w-10 md:h-1 bg-white mb-1 md:mb-2"></span>
                            <span className="block w-6 h-0.5 md:w-10 md:h-1 bg-white mb-1 md:mb-2"></span>
                            <span className="block w-6 h-0.5 md:w-10 md:h-1 bg-white"></span>
                        </button>
                    </div>

                    {/* Buttons take remaining space to the right */}
                    <div className="flex items-center ml-auto space-x-2">
                        {readyBusinessesCount > 0  && (
                            <button
                                onClick={onStartProductionForBusiness}
                                className="relative bg-red-600 text-white min-w-12 px-3 md:h-16 md:w-20 md:text-2xl py-2 rounded hover:bg-red-700 transition"
                            >
                                {readyBusinessesCount}
                                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black font-bold text-md w-5 h-5 flex items-center justify-center rounded-full">
                                    !
                                </span>
                            </button>
                        )}

                        <button
                            onClick={cyclePurchaseAmount}
                            className="bg-blue-500 text-white px-3 min-w-16 py-2 rounded md:h-16 md:w-24 md:text-2xl hover:bg-blue-600 transition"
                        >
                            {purchaseAmount}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;