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
        <div className="h-[75vh] overflow-y-auto overflow-x-hidden px-4">
            <div className="space-y-6"> {/* Consistent spacing between groups */}
                {/* Iterate over businesses to group unlocks */}
                {businesses.map((business, bizIdx) => (
                    <div key={bizIdx}>
                        {/* Business Name */}
                        <h3 className="text-md font-semibold mb-2 text-center">{business.name}</h3>
                        <div
                            className="grid grid-cols-[repeat(6,minmax(auto,2.5rem))] gap-5 justify-center"
                        >
                            {/* Display each unlock as an icon */}
                            {business.unlocks.map((unlock, unlockIdx) => (
                                <div
                                    key={unlockIdx}
                                    title={unlock.effect} // Tooltip showing unlock effect
                                    className={`relative w-10 h-10 flex flex-col items-center justify-center rounded shadow-sm focus:outline-none p-2 ${
                                        unlock.applied ? "bg-green-500" : "bg-gray-300 opacity-50"
                                    }`}
                                >
                                    {/* Icon (Checkmark or X) */}
                                    <span className="text-lg flex items-center justify-center flex-shrink-0 leading-none">
                                        {unlock.applied ? "✅" : "❌"}
                                    </span>

                                    {/* Number (Milestone Text) */}
                                    <span className="text-xs text-gray-800 text-center leading-none mt-0.5">
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