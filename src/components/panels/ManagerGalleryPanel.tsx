import React from "react";
import ImageCarousel from "../ImageCarousel.tsx";

// Define Prop Types
interface ManagerGalleryPanelProps {
    images: string[]; // Use the type of `unlocks` from `game`
}

const ManagerGalleryPanel: React.FC<ManagerGalleryPanelProps> = ({ images }) => {

    return (
        <div>
            <ImageCarousel
                images={images}
            />
        </div>
    );
};

export default ManagerGalleryPanel;