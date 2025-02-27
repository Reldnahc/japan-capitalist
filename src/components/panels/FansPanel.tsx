import React, {useState} from "react";
import Alert from "../Alert.tsx";
import {BsPeopleFill} from "react-icons/bs";
import {useAudioManager} from "../../contexts/AudioManagerProvider.tsx";
import Decimal from "break_infinity.js";
import {formatDecimalWithSuffix} from "../../utils/formatNumber.ts";

interface FansPanelProps {
    currentFans: Decimal;
    totalFans: Decimal;
    onClaimFans: () => void;
}

const FansPanel: React.FC<FansPanelProps> = ({ currentFans, totalFans, onClaimFans }) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Manage alert visibility
    const { play } = useAudioManager();

    const handleClaimFansClick = () => {
        play('tack');
        setIsAlertOpen(true); // Open the confirmation alert
    };

    const handleConfirmClaimFans = () => {
        play('tack');
        onClaimFans(); // Execute the actual "Claim Fans" action
        setIsAlertOpen(false); // Close the alert
    };

    const handleCancelClaimFans = () => {
        play('tack');
        setIsAlertOpen(false); // Dismiss the alert without action
    };

    return (
            <div className={`h-[70vh] overflow-y-auto px-6 flex flex-col gap-6 items-center rounded-lg scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800`}>
                <div className="text-center border-gray-500 border-2 rounded-lg p-4 mt-4 bg-gray-800 bg-opacity-80">
                    <BsPeopleFill className="mx-auto text-blue-600" size={40} />

                    <p className="text-base md:text-xl text-gray-300 mt-2">
                        Gather fans to restart your progress and enjoy a <span className={`text-lg md:text-2xl font-extrabold font-fredoka`}>1%</span> revenue bonus for every fan you claim!
                    </p>
                </div>

                <div className="flex flex-col text-center items-center h-32 justify-center w-full max-w-64 py-4 bg-blue-50 rounded-lg shadow">
                    <p className="text-lg font-medium text-gray-600">Available Fans to Claim:</p>
                    <div className="text-4xl font-extrabold text-blue-600 mt-2">{formatDecimalWithSuffix(currentFans)}</div>
                </div>

                <div className="flex flex-col text-center items-center h-32 justify-center w-full max-w-64 py-4 bg-green-50 rounded-lg shadow">
                    <p className="text-lg font-medium text-gray-600">Current Fans:</p>
                    <div className="text-4xl font-extrabold text-green-600 mt-2">{formatDecimalWithSuffix(totalFans)}</div>
                </div>
                <button
                    onClick={handleClaimFansClick}
                    className="bg-red-500 text-white px-8 py-4 rounded-md hover:bg-red-600 transition-all focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-bold mt-3"
                >
                    Claim Fans!
                </button>
                <Alert
                    isOpen={isAlertOpen}
                    text={
                        <div>
                            <strong>Warning:</strong> Are you sure you want to claim fans? <br />
                            <span className="text-red-600">This action will restart your game and cannot be undone.</span>
                        </div>
                    }
                    buttons={[
                        {
                            label: "Cancel!",
                            onClick: handleCancelClaimFans, // Action to cancel the operation
                            styleClass: "bg-red-500 text-white hover:bg-red-600",
                        },
                        {
                            label: "Restart!",
                            onClick: handleConfirmClaimFans, // Action to confirm and claim fans
                            styleClass: "bg-green-500 text-white hover:bg-green-600",
                        },
                    ]}
                    closeAlert={() => setIsAlertOpen(false)} // Close alert when dismissed
                />
            </div>
    );
};

export default FansPanel;