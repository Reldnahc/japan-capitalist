import React, { useState } from "react";
import { Reward } from "../gameLogic/dailyRewardManager.ts";

interface RewardBoxProps {
    index: number;
    reward: Reward;
    isClaimed: boolean;
    className?: string;
    onClick?: (index: number) => void;
}

const RewardBox: React.FC<RewardBoxProps> = ({ index, reward, isClaimed, className, onClick }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div
            className={`relative h-[80px] w-[80px] md:h-[110px] md:w-[110px] flex items-center justify-center border-2 rounded-lg
                ${isClaimed ? "bg-gray-500 border-green-500" : "bg-gray-800 border-gray-700"}
                ${className}`}
            onClick={() => onClick?.(index)} // Handle reward click if needed
            onMouseEnter={() => setIsTooltipVisible(true)} // Show tooltip on hover
            onMouseLeave={() => setIsTooltipVisible(false)} // Hide tooltip when hover ends
            onTouchStart={() => setIsTooltipVisible(!isTooltipVisible)} // Toggle tooltip on mobile touch
        >
            {/* Tooltip */}
            {isTooltipVisible && (
                <div className="absolute flex flex-col items-center bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded-lg top-[100%] mt-0.5 text-nowrap text-center z-[50] shadow-lg">
                    <span>{reward.description}</span>
                </div>
            )}

            {/* Reward Image */}
            <img
                src={reward.imagePath || "/path/to/placeholder.png"}
                alt={reward.description}
                className={`h-[70px] w-[70px] md:h-[100px] md:w-[100px] rounded-full ${isClaimed ? "opacity-50" : "opacity-100"}`}
            />
            {isClaimed && (
                <div className="absolute inset-0 border-green-500 border-4 rounded-full"></div>
            )}
            {/* Day Number Badge */}
            <div className="absolute bottom-0 right-0 text-gray-100 bg-black/70 px-2 py-1 text-xs rounded-tl">
                Day {index + 1}
            </div>
        </div>
    );
};

export default RewardBox;