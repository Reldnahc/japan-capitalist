import React from "react";
import {GlobalUnlock} from "../../gameLogic/types/unlocks.types.ts";
import {Business} from "../../gameLogic/types/business.types.ts";
import {AnimatePresence, motion} from "framer-motion";
import ManagerSelectionPanel from "./ManagerSelectionPanel.tsx";
import {useAudioManager} from "../../contexts/AudioManagerProvider.tsx";
import ManagerGalleryPanel from "./ManagerGalleryPanel.tsx";

// Define Prop Types
interface GalleryPanelProps {
    unlocks: GlobalUnlock[]; // Use the type definition from `game`
    businesses: Business[]; // List of businesses
    selectedBusiness: Business | null; // Initially selected business, if any
    setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
    direction: "left" | "right";
    setDirection: React.Dispatch<React.SetStateAction<"left" | "right">>;
}

const GalleryPanel: React.FC<GalleryPanelProps> = ({ unlocks, businesses, selectedBusiness, setSelectedBusiness, direction, setDirection }) => {

    const { play } = useAudioManager();

    // Animation Variants
    const containerVariants = {
        hidden: (dir: "left" | "right") => ({
            x: dir === "left" ? "100%" : "-100%", // Start off-screen based on direction
            opacity: 1,
        }),
        visible: {
            x: 0, // Slide into the center of the screen
            opacity: 1,
            transition: { ease: "easeInOut", duration: .4 },
        },
        exit: (dir: "left" | "right") => ({
            x: dir === "left" ? "-100%" : "100%", // Slide out to the left or right
            opacity: 1,
            transition: { ease: "easeInOut", duration: .4 },
        }),
    };

    const handleBusinessClick = (business: Business) => {
        play("tack");
        setDirection("left"); // Set direction for sliding left
        setTimeout(() => {
            setSelectedBusiness(business);
        }, 10); // A small delay to allow `direction`

    };


    const path = "/japan-capitalist/images/businesses/" + selectedBusiness?.name.toLowerCase().replace(" ", "") + "/";

    const keywords = ["casual", "halloween", "christmas", "kimono", "beach"]; // Add more keywords here as needed

    const filteredUnlocks = unlocks.filter((unlock) => {
        const matchesBusiness = selectedBusiness
            ? unlock.description.includes(selectedBusiness.name) // Check for business match
            : true; // If no `selectedBusiness`, allow all

        const matchesKeywords = keywords.some((keyword) =>
            unlock.description.toLowerCase().includes(keyword) // Check if description matches any keyword
        );

        return matchesBusiness && matchesKeywords; // Both conditions must be true
    });

    const imagePathArray = ["employee.webp"]; // Always include the base image

    keywords.forEach((keyword) => {
        // Check if filteredUnlocks contains any `unlock` matching the keyword
        const hasUnlock = filteredUnlocks.some((unlock) =>
            unlock.description.toLowerCase().includes(keyword) // Ensure unlock corresponds to the `keyword`
        );

        if (hasUnlock) {
            imagePathArray.push(`employee_${keyword}.webp`); // Add the corresponding image path
        }
    });

// Prepend the full path to each image
    const fullImagePaths = imagePathArray.map((img) => path + img);

    return (
        <div
            className={`h-[70vh] overflow-x-hidden ${!selectedBusiness ? 'overflow-y-auto' : 'overflow-y-hidden'} px-3 pb-8 text-white scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800`}>
            <AnimatePresence mode="wait">
                {/* Business Selection Panel */}
                {!selectedBusiness ? (
                    <motion.div
                        key="selection-panel"
                        variants={containerVariants}
                        custom={direction}
                        initial="hidden"
                        animate="visible"
                        exit="exit">
                        <ManagerSelectionPanel
                            businesses={businesses}
                            onBusinessClick={handleBusinessClick}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="details-panel"
                        variants={containerVariants}
                        custom={direction}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >

                        <ManagerGalleryPanel
                            images={fullImagePaths}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPanel;