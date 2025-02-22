import React from "react";

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
        <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-4">
            <div className="space-y-6"> {/* Consistent spacing between groups */}
                {/* Iterate over businesses to group unlocks */}
                {businesses.map((business, bizIdx) => (
                    <div key={bizIdx}>
                        {/* Business Name */}
                        <h3 className="text-xl md:text-3xl font-semibold mb-2 text-center">{business.name}</h3>
                        <div
                            className="grid grid-cols-[repeat(5,minmax(auto,2.5rem))] gap-5 justify-center"
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