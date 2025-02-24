import React from "react";

// Define Prop Types
interface ManagerGalleryPanelProps {
    unlocks: typeof game.businessManager.unlocks; // Use the type of `unlocks` from `game`
}

const ManagerGalleryPanel: React.FC<ManagerGalleryPanelProps> = ({ unlocks }) => {
    return (
        <div>
            {/* Placeholder content */}
            <h2>Manager Gallery Panel</h2>
            <p>Number of Unlocks: {unlocks ? unlocks.length : 0}</p>
            {unlocks && (
                <ul>
                    {unlocks.map((unlock, index) => (
                        <li key={index}>{JSON.stringify(unlock)}</li> // Adjust as necessary for unlock structure
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManagerGalleryPanel;