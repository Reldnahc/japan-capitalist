import React from "react";

// Define Prop Types
interface GalleryPanelProps {
    unlocks: typeof game.businessManager.unlocks; // Use the type definition from `game`
    totalFans: number; // Total fans as a number
}

const GalleryPanel: React.FC<GalleryPanelProps> = ({ unlocks, totalFans }) => {
    return (
        <div>
            {/* Empty structure for now */}
            <h2>Gallery Panel</h2>
            <p>Total Fans: {totalFans}</p>
            <p>Unlocks: {unlocks ? unlocks.length : 0}</p>
        </div>
    );
};

export default GalleryPanel;