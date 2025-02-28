import {Reward} from "../gameLogic/dailyRewardManager.ts";

interface RewardBoxProps {
    index: number;
    reward: Reward;
    isClaimed: boolean;
    className?: string;
    onClick?: (index: number) => void;
    tooltipText?: string;
}

const RewardBox: React.FC<RewardBoxProps> = ({ index, reward, isClaimed, className, onClick, tooltipText }) => (
    <div
        className={`relative h-[80px] w-[80px] flex items-center justify-center border-2 rounded-lg
            ${isClaimed ? "bg-gray-500 border-green-500" : "bg-gray-800 border-gray-700"}
            ${className}`}
        onClick={() => onClick?.(index)} // Handle click if `onClick` is provided
        title={tooltipText || ""} // Display tooltip if `tooltipText` is provided
    >
        <img
            src={"/path/to/placeholder.png"}
            alt={reward.description}
            className={`h-[50px] w-[50px] ${isClaimed ? "opacity-50" : "opacity-100"}`}
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

export default RewardBox;