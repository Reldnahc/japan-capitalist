import React, {useState, useEffect, useCallback} from 'react';
import {IdleGame} from '../gameLogic/idleGame';
import Footer from "./Footer.tsx";
import UnlocksPanel from "./panels/UnlocksPanel.tsx";
import Notification from "./Notification.tsx";
import ModalPanel from "./ModelPanel.tsx";
import BusinessCard from "./BusinessCard.tsx";
import ManagerPanel from "./panels/ManagerPanel.tsx";
import {Business} from "../gameLogic/types/business.types.ts";
import {formatPlaytime} from "../utils/formatTime.ts";
import {AudioManager} from "../utils/audioManager.ts";
import backgroundMusic from '../assets/sounds/background.mp3';
import cashRegisterSound from '../assets/sounds/cash-register.mp3';
import SettingsPanel from "./panels/SettingsPanel.tsx";
import { motion, AnimatePresence } from "framer-motion";
import FansPanel from "./panels/FansPanel.tsx";

// Extend the TypeScript definition for the Window object
declare global {
    interface Window {
        money: (amount: string) => void;
        fans: (amount: string) => void;
    }
}

const game = new IdleGame();

const Game = () => {
    const [currency, setCurrency] = useState(game.businessManager.currency);
    const [fans, setFans] = useState(game.businessManager.fans);
    const [businesses, setBusinesses] = useState(game.businessManager.businesses);
    const [progress, setProgress] = useState<number[]>(new Array(game.businessManager.businesses.length).fill(0));
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [purchaseAmount, setPurchaseAmount] = useState("x1"); // New state for selected purchase amount
    const [isMuted, setIsMuted] = useState(AudioManager.getMuted());
    const [volume, setVolume] = useState(0.5); // Default half volume
    const [appliedUnlocks, setAppliedUnlocks] = useState(() =>
        game.businessManager.businesses.map((biz) => biz.unlocks.map((unlock) => unlock.applied))
    );

    const readyBusinessesCount = businesses.filter(
        (business) => business.quantity > 0 && !business.isProducing && business.manager?.hired === false
    ).length;

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "m" || event.key === "M") {
                // Toggle mute when "M" key is pressed
                toggleMute();
            } else if (["1", "2", "3", "4", "5", "6"].includes(event.key)) {
                // Map nummber keys to specific purchase amounts
                let selectedAmount: string;
                switch (event.key) {
                    case "1":
                        selectedAmount = "x1"; // 1 maps to x1
                        break;
                    case "2":
                        selectedAmount = "x5"; // 2 maps to x5
                        break;
                    case "3":
                        selectedAmount = "x10"; // 3 maps to x10
                        break;
                    case "4":
                        selectedAmount = "x100"; // 4 maps to x100
                        break;
                    case "5":
                        selectedAmount = "next"; // 5 maps to next
                        break;
                    case "6":
                        selectedAmount = "max"; // 6 maps to max
                        break;
                    default:
                        selectedAmount = "x1"; // Default to x1 if no match
                        break;
                }
                setPurchaseAmount(selectedAmount); // Update the selected purchase amount
            }
        };

        // Add the event listener
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    useEffect(() => {
        window.money = (amount: string) => {
            game.businessManager.earnMoney(BigInt(amount), false);
        };
        window.fans = (amount: string) => {
            game.businessManager.addFans(BigInt(amount));
        };

        console.log("Specific game functions are now available globally in the console!");
    }, []);

    // Update currency and progress bars using requestAnimationFrame for smooth updates
    useEffect(() => {
        const update = () => {
            setCurrency(game.businessManager.currency);
            setFans(game.businessManager.fans);
            setBusinesses([...game.businessManager.businesses]);
            const updatedProgress = game.businessManager.businesses.map((_, index) => {
                if (!game.businessManager.businesses[index].isProducing) return 0;
                const now = Date.now();
                const elapsed = now - game.businessManager.businesses[index].startTime;
                const pct = (elapsed / game.businessManager.businesses[index].productionTime) * 100;
                return Math.min(pct, 100);
            });
            setProgress(updatedProgress);

            game.businessManager.businesses.forEach((biz, bizIdx) => {
                biz.unlocks.forEach((unlock, unlockIdx) => {
                    if (!appliedUnlocks[bizIdx][unlockIdx] && unlock.applied && !unlock.notified) {
                        // Parse the effect to determine the target and effect description
                        const effectParts = unlock.effect.split(";");
                        const effectDescription = effectParts[0].trim(); // E.g., "Revenue ×2" or "Speed +300%"
                        const target = effectParts[1]?.trim(); // E.g., "takoyaki", "ALL", or undefined

                        let message;

                        if (!target) {
                            // If no target is specified, default to the current business
                            message = `Unlocked: ${effectDescription} for ${biz.name}!`;
                        } else if (target === "ALL") {
                            // If the target is ALL businesses
                            message = `Unlocked: ${effectDescription} for ALL businesses!`;
                        } else {
                            // If specific businesses are targeted
                            const specificBusinesses = target.split(",").map((b) => b.trim()).join(", ");
                            message = `Unlocked: ${effectDescription} for ${specificBusinesses}!`;
                        }

                        // Trigger a single notification
                        showNotification(message);

                        // Set the notification flag for this unlock
                        unlock.notified = true;
                    }
                });
            });

            setAppliedUnlocks(
                game.businessManager.businesses.map((biz) => biz.unlocks.map((unlock) => unlock.applied))
            );

            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }, []);

    useEffect(() => {
        if (activePanel) {
            document.body.style.overflow = "hidden"; // Disable scrolling when a panel is open
        } else {
            document.body.style.overflow = ""; // Re-enable scrolling when no panel is active
        }

        // Cleanup to ensure scrolling is re-enabled if the component unmounts
        return () => {
            document.body.style.overflow = "";
        };
    }, [activePanel]);

    // Load sounds on mount
    useEffect(() => {
        // Centralize all sounds in AudioManager
        AudioManager.loadSounds({
            background: backgroundMusic,
            cashRegister: cashRegisterSound,
        });

        // Play background music on loop
        AudioManager.audioElements['background'].loop = true;
        if (!isMuted) {
            AudioManager.play('background');
        }

        return () => {
            AudioManager.pause('background'); // Pause the background music when the component unmounts
        };
    }, [isMuted]);


    // Handle volume changes
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume); // Update the React state
        AudioManager.setVolume(newVolume); // Sync AudioManager's volume
    };

// Toggle mute sounds
    const toggleMute = () => {
        setIsMuted((prev) => !prev); // Update the React state
        if (isMuted) {
            AudioManager.unmute();
        } else {
            AudioManager.mute();
        }
    };


    const closePanel = () => {
        setActivePanel(null);
    };

    const panelVariants = {
        hidden: {
            opacity: 0,
            y: 50, // Panel starts slightly below
        },
        visible: {
            opacity: 1,
            y: 0, // Animate to its original position
            transition: {
                duration: 0.3,
            },
        },
        exit: {
            opacity: 0,
            y: 50, // Exit by fading and moving down
            transition: {
                duration: 0.2,
            },
        },
    };


    const showNotification = (message: string) => {
        setNotification(message);
    };

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const handleManagerUpgrade = (businessIndex: number, upgradeIndex: number) => {
        game.businessManager.buyManagerUpgrade(businessIndex, upgradeIndex);
        setBusinesses([...game.businessManager.businesses]); // Update UI state
        setCurrency(game.businessManager.currency); // Reflect new currency after the purchase
    };

    const getNextUnlockMilestone = (business: typeof businesses[number]): number => {
        for (const unlock of business.unlocks) {
            if (!unlock.applied) {
                return unlock.milestone; // Return the first unmet milestone
            }
        }
        return 0; // If all unlocks are met
    };

    const formatTime = (seconds: number): string => {
        // Convert to hours, minutes, and remaining seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        // Format time into a readable string
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    };

    const handleOpenPanel = (panelName: string) => {
        if (panelName === "Managers") {
            setSelectedBusiness(null); // Reset selected business when Managers is opened
        }
        setActivePanel(panelName); // Open the requested panel
    };

    const handleBuyBusiness = (index: number, amount: string = purchaseAmount) => {
        game.businessManager.buyBusiness(index, amount);
        AudioManager.play('cashRegister');
        setCurrency(game.businessManager.currency);
        setBusinesses([...game.businessManager.businesses]);
    };

    const handleBuyOneBusiness = (index: number) => {
        handleBuyBusiness(index, "x1")
    };

    const handleStartProduction = (index: number) => {
        game.businessManager.startProduction(index);
        setBusinesses([...game.businessManager.businesses]);
    };

    const handleBuyManager = (index: number) => {
        game.businessManager.buyManager(index);
        setCurrency(game.businessManager.currency);
        setBusinesses([...game.businessManager.businesses]);
    };

    const handleClickManager = (index: number) => {
        setSelectedBusiness(businesses[index]);
        setActivePanel("Managers");
    };

    const handleStartProductionForBusiness = () => {
        const nonProducingBusinesses = businesses.filter(
            (business) => business.quantity > 0 && !business.isProducing
        );

        if (nonProducingBusinesses.length > 0) {
            const index = businesses.indexOf(nonProducingBusinesses[0]);
            game.businessManager.startProduction(index);
            setBusinesses([...game.businessManager.businesses]);
        } else {
            showNotification("All businesses are producing!");
        }
    };

    const handlePrestige = () => {
        game.prestige();
    }
    return (
        <div
            className="font-baloo w-full max-w-xl flex flex-col bg-cover bg-no-repeat min-h-screen shadow-lg rounded-lg"
            style={{ backgroundImage: `url('/japan-capitalist/images/background.webp')` }}
        >
            {notification && (
                <Notification message={notification} onClose={closeNotification}/>
            )}
            {/* Conditional Panel UI */}
            <AnimatePresence>
                {activePanel && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        {/* Static Background (No animation applied here) */}
                        <motion.div
                            key="modal-panel"
                            initial="hidden" // Panel starts in the hidden state
                            animate="visible" // On mount, animate to the visible state
                            exit="exit" // On unmount, animate to the exit state
                            variants={panelVariants} // Apply panel-specific animation variants
                            className=" p-6 rounded-lg shadow-lg w-full max-w-xl"
                        >
                            <ModalPanel
                                title={
                                    activePanel === "Managers" && selectedBusiness
                                        ? `Managers - ${selectedBusiness.name}`
                                        : activePanel
                                }
                                onClose={closePanel}
                            >
                                {activePanel === "Unlocks" && (
                                    <UnlocksPanel businesses={businesses} />
                                )}

                                {activePanel === "Managers" && (
                                    <ManagerPanel
                                        businesses={businesses}
                                        selectedBusiness={selectedBusiness}
                                        setSelectedBusiness={setSelectedBusiness}
                                        onHireManager={handleBuyManager}
                                        currency={currency}
                                        onManagerUpgrade={handleManagerUpgrade}
                                    />
                                )}
                                {activePanel === "Fans" && (
                                    <FansPanel
                                        currentFans={game.businessManager.currentFans}
                                        totalFans={fans}
                                        onClaimFans={handlePrestige}
                                    />

                                )}
                                {activePanel === "Settings" && (
                                    <SettingsPanel
                                        isMuted={isMuted}
                                        volume={volume}
                                        formatPlaytime={formatPlaytime}
                                        totalPlaytime={game.getTotalPlaytime()}
                                        onToggleMute={toggleMute}
                                        onVolumeChange={handleVolumeChange}
                                        onResetGame={() => game.resetGame()}
                                    />
                                )}
                            </ModalPanel>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <div className="w-full max-w-lg space-y-4 px-2 pt-6 pb-32 mx-auto">
                {businesses.map((biz, index) => (
                    <BusinessCard
                        key={index}
                        business={biz}
                        currency={currency}
                        purchaseAmount={purchaseAmount}
                        progress={progress[index]}
                        onStartProduction={() => handleStartProduction(index)}
                        onBuyBusiness={() => handleBuyBusiness(index)}
                        onBuyOneBusiness={() => handleBuyOneBusiness(index)}
                        onClickManager={() => handleClickManager(index)}
                        formatTime={formatTime}
                        nextUnlockMilestone={getNextUnlockMilestone(biz)}
                        fans={fans}
                    />
                ))}
            </div>
            <Footer
                currency={currency}
                purchaseAmount={purchaseAmount}
                onOpenPanel={handleOpenPanel}
                onPurchaseAmountChange={(amount) => setPurchaseAmount(amount)}
                onStartProductionForBusiness={handleStartProductionForBusiness}
                readyBusinessesCount={readyBusinessesCount}
                isMuted={isMuted}
                onToggleMute={toggleMute}
            />
        </div>
    );

};

export default Game;
