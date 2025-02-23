import { Business } from "../../gameLogic/types/business.types";
import { formatBigIntWithSuffix } from "../../utils/formatNumber.ts";
import React, { useState } from "react";
import { useAudioManager } from "../../contexts/AudioManagerProvider.tsx";
import { motion, AnimatePresence } from "framer-motion";

type ManagerPanelProps = {
    businesses: Business[]; // List of businesses
    selectedBusiness: Business | null; // Initially selected business, if any
    setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
    onHireManager: (index: number) => void; // Function to handle hiring a manager
    currency: bigint;
    onManagerUpgrade: (businessIndex: number, upgradeIndex: number) => void;
};

const ManagerPanel: React.FC<ManagerPanelProps> = ({
                                                       businesses,
                                                       selectedBusiness,
                                                       setSelectedBusiness,
                                                       onHireManager,
                                                       currency,
                                                       onManagerUpgrade,
                                                   }) => {
    const [direction, setDirection] = useState<"left" | "right">("left"); // Controls animation direction
    const { play } = useAudioManager();

    // Animation Variants
    const containerVariants = {
        hidden: (dir: "left" | "right") => ({
            x: dir === "left" ? "100%" : "-100%", // Start off-screen based on direction
            opacity: 0,
        }),
        visible: {
            x: 0, // Slide into the center of the screen
            opacity: 1,
            transition: { ease: "easeInOut", duration: 0.5 },
        },
        exit: (dir: "left" | "right") => ({
            x: dir === "left" ? "-100%" : "100%", // Slide out to the left or right
            opacity: 0,
            transition: { ease: "easeInOut", duration: 0.5 },
        }),
    };

    const handleBusinessClick = (business: Business) => {
        play("tack");
        setDirection("left"); // Set direction for sliding left
        setSelectedBusiness(business);
    };

    const handleBack = () => {
        play("tack");
        setDirection("right"); // Set direction for sliding right
        setSelectedBusiness(null);
    };

    return (
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-3 pb-8 text-white scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
            <AnimatePresence mode="wait" custom={direction}>
                {/* Business Selection Panel */}
                {!selectedBusiness && (
                    <motion.div
                        key="selection-panel"
                        variants={containerVariants}
                        custom={direction} // Pass the direction to the variants
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-2 gap-3 w-full"
                    >
                        {businesses.map((business, index) => (
                            <div
                                key={index}
                                className="shadow border-gray-500 border-2 rounded-lg p-4 bg-opacity-80 bg-gray-800 cursor-pointer hover:bg-opacity-95"
                                onClick={() => handleBusinessClick(business)}
                            >
                                <h3 className="text-lg md:text-2xl font-bold text-center z-20 ">
                                    {business.name}
                                </h3>
                                <div
                                    key={business.name}
                                    className="relative flex flex-col items-center mx-auto w-32 h-32 md:w-40 md:h-40 bg-gray-100 px-4 py-1 shadow-sm rounded-full hover:shadow-2xl bg-no-repeat bg-center opacity-100 bg-cover transition"
                                    style={{
                                        backgroundImage: `url('/japan-capitalist/images/businesses/${business.name
                                            .toLowerCase()
                                            .replace(" ", "")}/employee_face.webp')`,
                                    }}
                                ></div>
                                <h3 className="text-md md:text-lg font-semibold text-center z-20">
                                    {business.manager?.name}
                                </h3>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Manager Details Panel */}
                {selectedBusiness && (
                    <motion.div
                        key="details-panel"
                        custom={direction} // Pass the direction to the variants
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative flex flex-col h-[70vh] max-w-md mx-auto px-3 rounded-lg"
                    >
                        <div className="absolute top-0 right-0 -mr-6">

                        </div>
                        <button
                            className="sticky top-0 w-16 -ml-6 text-blue-500 hover:underline flex items-center"
                            onClick={handleBack}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            <span className="mb-0.5">Back</span>
                        </button>
                        <div className="text-center">
                            <img
                                src={`/japan-capitalist/images/businesses/${selectedBusiness.name
                                    .toLowerCase()
                                    .replace(" ", "")}/employee.webp`}
                                alt={selectedBusiness.name}
                                className=" object-contain rounded -mt-6"
                            />

                            <div
                                className={`border-gray-500 border-2 rounded-lg px-4 mt-4 bg-gray-800 bg-opacity-80`}
                            >
                                <p className="text-2xl text-white mt-3 mb-2 font-fredoka">
                                    {selectedBusiness.manager?.name} -
                                    <span className="font-yuji">{selectedBusiness.manager?.kanji}</span>
                                </p>
                                {selectedBusiness.manager?.bio && (
                                    <p className="text-base md:text-lg text-gray-50 italic mb-6 text-left">
                                        "{selectedBusiness.manager.bio}"
                                    </p>
                                )}
                            </div>
                            {selectedBusiness.manager?.hired ? (
                                <div className="mt-4">
                                    <h4 className="text-3xl text-gray-50 font-semibold mb-3">
                                        Upgrades
                                    </h4>
                                    <div className="space-y-2 pb-8">
                                        {selectedBusiness.manager.upgrades?.map(
                                            (upgrade, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex justify-between items-center px-4 py-2 rounded-md ${
                                                        upgrade.unlocked
                                                            ? "bg-green-100 opacity-30"
                                                            : "bg-gray-300"
                                                    }`}
                                                >
                                                    <span className=" text-sm md:text-base text-gray-800 font-bold w-32">
                                                        {upgrade.effect}
                                                    </span>
                                                    <span className="text-gray-800 text-sm md:text-lg w-full ml-6  text-left">
                                                        ¥{formatBigIntWithSuffix(upgrade.cost)}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const businessIndex =
                                                                businesses.findIndex(
                                                                    (b) =>
                                                                        b.name ===
                                                                        selectedBusiness.name
                                                                );
                                                            if (businessIndex >= 0) {
                                                                onManagerUpgrade(
                                                                    businessIndex,
                                                                    idx
                                                                );
                                                            }
                                                        }}
                                                        disabled={
                                                            upgrade.unlocked ||
                                                            currency < upgrade.cost
                                                        }
                                                        className={`relative px-1 py-1 text-xs md:text-lg rounded w-20 md:w-28 flex  justify-center items-center ${
                                                            upgrade.unlocked
                                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                                : currency < upgrade.cost
                                                                    ? "bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed"
                                                                    : "bg-gold-gradient text-white hover:brightness-120 animate-gold-glow shadow-gold-outer"
                                                        }`}
                                                        style={{
                                                            backgroundSize:
                                                                "300% 300%",
                                                        }}
                                                    >
                                                        {!upgrade.unlocked &&
                                                            currency >=
                                                            upgrade.cost && (
                                                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/50 to-white/10 opacity-0 hover:opacity-75 animate-shine pointer-events-none" />
                                                            )}

                                                        <span
                                                            className={`text-sm md:text-base font-extrabold ${
                                                                upgrade.unlocked
                                                                    ? ""
                                                                    : currency <
                                                                    upgrade.cost
                                                                        ? ""
                                                                        : "[text-shadow:0px_1px_2px_rgba(255,215,0,0.9),0px_3px_5px_rgba(0,0,0,0.8)]"
                                                            }`}
                                                        >
                                                            {upgrade.unlocked
                                                                ? "Bought"
                                                                : "Buy"}
                                                        </span>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="relative  mt-3 bg-green-500 text-white px-4 py-2 mb-6 rounded hover:bg-green-600 focus:outline-none"
                                    onClick={() => {
                                        const index = businesses.findIndex(
                                            (business) =>
                                                business.name ===
                                                selectedBusiness.name
                                        );
                                        if (index >= 0) {
                                            onHireManager(index);
                                        }
                                    }}
                                >
                                    Hire for ¥
                                    {formatBigIntWithSuffix(
                                        selectedBusiness.manager?.cost ||
                                        BigInt(0)
                                    )}
                                    {!selectedBusiness.manager?.hired &&
                                        selectedBusiness.manager?.cost &&
                                        currency >=
                                        selectedBusiness.manager?.cost && (
                                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold text-xl w-6 h-6 flex items-center justify-center rounded-full">
                                                !
                                            </span>
                                        )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManagerPanel;