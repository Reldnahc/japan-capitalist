import { Business } from "../../gameLogic/types/business.types";
import { useAudioManager } from "../../contexts/AudioManagerProvider.tsx";
import ManagerDetailsPanel from "./ManagerDetailsPanel.tsx";
import ManagerSelectionPanel from "./ManagerSelectionPanel.tsx";
import {AnimatePresence, motion} from "framer-motion";

type ManagerPanelProps = {
    businesses: Business[]; // List of businesses
    selectedBusiness: Business | null; // Initially selected business, if any
    setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
    onHireManager: (index: number) => void; // Function to handle hiring a manager
    currency: bigint;
    onManagerUpgrade: (businessIndex: number, upgradeIndex: number) => void;
    direction: "left" | "right";
    setDirection: React.Dispatch<React.SetStateAction<"left" | "right">>;

};

const ManagerPanel: React.FC<ManagerPanelProps> = ({
                                                       businesses,
                                                       selectedBusiness,
                                                       setSelectedBusiness,
                                                       onHireManager,
                                                       currency,
                                                       onManagerUpgrade,
                                                       direction,
                                                       setDirection
                                                   }) => {
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

    return (
        <div
            className="h-[70vh] overflow-x-hidden overflow-y-auto px-3 pb-8 text-white scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
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
                            exit="exit">
                            <ManagerDetailsPanel
                                selectedBusiness={selectedBusiness}
                                businesses={businesses}
                                onHireManager={onHireManager}
                                onManagerUpgrade={onManagerUpgrade}
                                currency={currency}
                            />
                        </motion.div>
                    )}
            </AnimatePresence>
        </div>
    );
};

export default ManagerPanel;