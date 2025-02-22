import { Business } from "../../gameLogic/types/business.types";
import {formatBigIntWithSuffix} from "../../utils/formatNumber.ts";
import React from "react";

type ManagerPanelProps = {
    businesses: Business[]; // List of businesses
    selectedBusiness: Business | null; // Initially selected business, if any
    setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
    onHireManager: (index: number) => void; // Function to handle hiring a manager
    currency: bigint;
    onManagerUpgrade: (businessIndex: number, upgradeIndex: number) => void;
};

const ManagerPanel: React.FC<ManagerPanelProps> = ({businesses, selectedBusiness, setSelectedBusiness, onHireManager,
                                                       currency, onManagerUpgrade}) => {

    const handleBack = () => setSelectedBusiness(null); // Back to the selection screen

    return (
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-3 pb-8" >
            {/* Business Selection Panel */}
            {!selectedBusiness && (
                <div className="grid grid-cols-2 gap-3 w-full">
                    {businesses.map((business, index) => (
                        <div key={index} className="shadow">
                            <h3 className="text-lg font-bold text-center z-20 ">
                                {business.name}
                            </h3>
                            <div
                                key={business.name}
                                className="relative flex flex-col items-center mx-auto w-32 h-32 md:w-40 md:h-40 bg-gray-100 px-4 py-1 shadow-sm rounded-full cursor-pointer hover:shadow-2xl bg-no-repeat bg-center opacity-100  bg-cover transition"
                                onClick={() => setSelectedBusiness(business)}
                                style={{ backgroundImage: `url('/japan-capitalist/images/businesses/${business.name.toLowerCase().replace(" ","")}/employee_face.webp')` }}
                            >
                            </div>
                            <h3 className="text-md font-semibold text-center z-20">
                                {business.manager?.name}
                            </h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Manager Details Panel */}
            {selectedBusiness && (
                <div className="relative flex flex-col h-[70vh] max-w-md mx-auto  px-3 rounded-lg">
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
                            src={`/japan-capitalist/images/businesses/${selectedBusiness.name.toLowerCase().replace(" ","")}/employee.webp`}
                            alt={selectedBusiness.name}
                            className=" object-contain rounded -mt-6"
                        />
                        <p className="text-2xl text-black mt-3 mb-1 font-fredoka">
                            {selectedBusiness.manager?.name} - <span className="font-yuji">{selectedBusiness.manager?.kanji}</span>
                        </p>
                        {selectedBusiness.manager?.bio && (
                            <p className="text-md text-gray-600 italic mb-6 text-left">
                                "{selectedBusiness.manager.bio}"
                            </p>
                        )}
                        {selectedBusiness.manager?.hired ? (
                            <div className="mt-4">
                                <h4 className="text-3xl text-gray-800 font-semibold mb-3">Upgrades</h4>
                                <div className="space-y-2 pb-8">
                                    {selectedBusiness.manager.upgrades?.map((upgrade, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex justify-between items-center px-4 py-2 rounded-md ${
                                                upgrade.unlocked ? "bg-green-100" : "bg-gray-200"
                                            }`}
                                        >
                                            <span className="font-medium text-sm md:text-base w-32">{upgrade.effect}</span>
                                            <span className="text-gray-800 text-sm md:text-lg w-full ml-6  text-left">¥${formatBigIntWithSuffix(upgrade.cost)}</span>
                                            <button
                                                onClick={() => {
                                                    const businessIndex = businesses.findIndex(
                                                        (b) => b.name === selectedBusiness.name
                                                    );
                                                    if (businessIndex >= 0) {
                                                        onManagerUpgrade(businessIndex, idx);
                                                    }
                                                }}
                                                disabled={upgrade.unlocked || currency < upgrade.cost}
                                                className={`relative px-1 py-1 text-xs md:text-lg rounded w-20 md:w-28 flex justify-center items-center ${
                                                    upgrade.unlocked
                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                        : currency < upgrade.cost
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Can't afford: gray background
                                                            : "bg-gold-gradient text-white hover:brightness-120 animate-gold-glow shadow-gold-outer" // Can afford: gold button
                                                }`}
                                                style={{
                                                    backgroundSize: '300% 300%',
                                                }}
                                            >
                                                {/* Shine Animation Overlay (only for active buttons) */}
                                                {!upgrade.unlocked && currency >= upgrade.cost && (
                                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/50 to-white/10 opacity-0 hover:opacity-75 animate-shine pointer-events-none" />
                                                )}

                                                {/* Button Text */}
                                                <span
                                                    className={`text-sm md:text-base font-extrabold ${
                                                        upgrade.unlocked
                                                            ? "" // No special styling for unlocked buttons
                                                            : currency < upgrade.cost
                                                                ? "" // No text shadow for unaffordable gray buttons
                                                                : "[text-shadow:0px_1px_2px_rgba(255,215,0,0.9),0px_3px_5px_rgba(0,0,0,0.8)]" // Special gold shadow styling
                                                    }`}
                                                >
                                                {upgrade.unlocked ? "Bought" : "Buy"}
                                            </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            ) : (
                            <button
                                className="relative bg-green-500 text-white px-4 py-2 mb-6 rounded hover:bg-green-600 focus:outline-none"
                                onClick={() => {
                                    const index = businesses.findIndex(
                                        (business) => business.name === selectedBusiness.name
                                    );
                                    if (index >= 0) {
                                        onHireManager(index);
                                    }
                                }}
                            >
                                Hire for ¥{formatBigIntWithSuffix(selectedBusiness.manager?.cost || BigInt(0))}
                                { !selectedBusiness.manager?.hired && selectedBusiness.manager?.cost && currency >= selectedBusiness.manager?.cost && (
                                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold text-xl w-6 h-6 flex items-center justify-center rounded-full">
                                    !
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerPanel;