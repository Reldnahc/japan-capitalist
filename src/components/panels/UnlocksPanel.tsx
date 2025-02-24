import React from "react";
import {FaImage} from "react-icons/fa";

type Unlock = {
    effect: string;
    applied: boolean;
    milestone: number;
};

type Business = {
    name: string;
    unlocks: Unlock[];
};

type UnlocksPanelProps = {
    businesses: Business[];
};

const UnlocksPanel: React.FC<UnlocksPanelProps> = ({ businesses }) => {
    return (
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
            <div className="space-y-6"> {/* Consistent spacing between groups */}
                {/* Iterate over businesses to group unlocks */}
                {businesses.map((business, bizIdx) => (
                    <div key={bizIdx}>
                        {/* Business Name */}
                        <h3 className="text-xl md:text-3xl text-white font-semibold mb-2 text-center">{business.name}</h3>
                        <div
                            className="grid grid-cols-[repeat(4,minmax(auto,2.5rem))] md:grid-cols-[repeat(5,minmax(auto,2.5rem))] gap-5 justify-center"
                        >
                            {/* Display each unlock as an icon */}
                            {business.unlocks.map((unlock, unlockIdx) => (
                                <div
                                    key={unlockIdx}
                                    title={unlock.effect.replace(";"," for")} // Tooltip showing unlock effect
                                    className={`relative w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center rounded shadow-sm focus:outline-none p-2 ${
                                        unlock.applied ? "bg-green-500" : "bg-gray-400 opacity-50"
                                    }`}
                                >
                                    <img
                                        src={`/japan-capitalist/images/businesses/${business.name.toLowerCase().replace(" ","")}/icon.webp`}
                                        alt={business.name}
                                        className=" object-contain rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center mt-1 flex-shrink-0 leading-none"
                                    />
                                    { unlock.effect.includes("Unlocked") && (
                                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white font-bold text-md w-7 h-7 flex items-center justify-center rounded-full">
                                            <FaImage/>
                                        </span>
                                    )}

                                    {/* Number (Milestone Text) */}
                                    <span className="text-sm md:text-base text-gray-800 text-center mb-1 leading-none mt-0.5">
                                        {unlock.milestone || "N/A"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UnlocksPanel;