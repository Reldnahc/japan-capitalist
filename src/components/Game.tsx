import {useState, useEffect, useCallback} from 'react';
import {IdleGame} from '../gameLogic/idleGame';
import Footer from "./Footer.tsx";
import UnlocksPanel from "./panels/UnlocksPanel.tsx";
import Notification from "./Notification.tsx";
import ModalPanel from "./ModelPanel.tsx";
import BusinessCard from "./BusinessCard.tsx";
import ManagerPanel from "./panels/ManagerPanel.tsx";
import {Business} from "../gameLogic/types/business.types.ts";

const game = new IdleGame();

const Game = () => {
    const [currency, setCurrency] = useState(game.currency);
    const [businesses, setBusinesses] = useState(game.businesses);
    const [progress, setProgress] = useState<number[]>(new Array(game.businesses.length).fill(0));
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [stableReadyBusinessesCount, setStableReadyBusinessesCount] = useState(0);
    const [purchaseAmount, setPurchaseAmount] = useState("x1"); // New state for selected purchase amount
    const [appliedUnlocks, setAppliedUnlocks] = useState(() =>
        game.businesses.map((biz) => biz.unlocks.map((unlock) => unlock.applied))
    );

    const readyBusinessesCount = businesses.filter(
        (business) => business.quantity > 0 && !business.isProducing
    ).length;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStableReadyBusinessesCount(readyBusinessesCount); // Update the stable count after 11ms
        }, 11);

        return () => clearTimeout(timeout); // Clean up to prevent memory leaks
    }, [readyBusinessesCount]);

    // Update currency and progress bars using requestAnimationFrame for smooth updates
    useEffect(() => {
        const update = () => {
            setCurrency(game.currency);
            setBusinesses([...game.businesses]);
            const updatedProgress = game.businesses.map((_, index) => {
                if (!game.businesses[index].isProducing) return 0;
                const now = Date.now();
                const elapsed = now - game.businesses[index].startTime;
                const pct = (elapsed / game.businesses[index].productionTime) * 100;
                return Math.min(pct, 100);
            });
            setProgress(updatedProgress);

            game.businesses.forEach((biz, bizIdx) => {
                biz.unlocks.forEach((unlock, unlockIdx) => {
                    if (!appliedUnlocks[bizIdx][unlockIdx] && unlock.applied && !unlock.notified) {
                        // Trigger a notification for the new unlock
                        showNotification(`Unlocked: ${unlock.effect} for ${biz.name}!`);
                        unlock.notified = true;
                    }
                });
            });

            setAppliedUnlocks(
                game.businesses.map((biz) => biz.unlocks.map((unlock) => unlock.applied))
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

    const closePanel = () => {
        setActivePanel(null);
    };

    const showNotification = (message: string) => {
        setNotification(message);
    };

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const handleManagerUpgrade = (businessIndex: number, upgradeIndex: number) => {
        game.buyManagerUpgrade(businessIndex, upgradeIndex);
        setBusinesses([...game.businesses]); // Update UI state
        setCurrency(game.currency); // Reflect new currency after the purchase
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

    const handleBuyBusiness = (index: number) => {
        game.buyBusiness(index, purchaseAmount);
        setCurrency(game.currency);
        setBusinesses([...game.businesses]);
    };

    const handleStartProduction = (index: number) => {
        game.startProduction(index);
        setBusinesses([...game.businesses]);
    };

    const handleBuyManager = (index: number) => {
        game.buyManager(index);
        setCurrency(game.currency);
        setBusinesses([...game.businesses]);
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
            game.startProduction(index);
            setBusinesses([...game.businesses]);
        } else {
            showNotification("All businesses are producing!");
        }
    };

    return (
        <div
            className="font-baloo w-full max-w-xl flex flex-col bg-gradient-to-r from-green-100 to-blue-200 min-h-screen shadow-lg rounded-lg">
            {notification && (
                <Notification message={notification} onClose={closeNotification}/>
            )}
            {/* Conditional Panel UI */}
            {activePanel && (
                <ModalPanel title={activePanel === "Managers" && selectedBusiness
                    ? `Managers - ${selectedBusiness.name}`
                    : activePanel}
                            onClose={closePanel}>
                    {activePanel === "Unlocks" && (
                        <UnlocksPanel businesses={businesses}/>
                    )}

                    {activePanel === "Managers" && (
                        <ManagerPanel businesses={businesses}
                                      selectedBusiness={selectedBusiness}
                                      setSelectedBusiness={setSelectedBusiness}
                                      onHireManager={handleBuyManager}
                                      currency={currency}
                                      onManagerUpgrade={handleManagerUpgrade}
                        />
                    )}

                    {activePanel === "Settings" && (
                        <div className="h-[80vh] flex flex-col items-center mt-16">
                            <button
                                onClick={() => game.resetGame()} // Ensures the method is executed on the correct instance
                                className="bg-red-500 text-white px-4 py-2 rounded mb-6 hover:bg-red-600"
                            >
                                Reset Game
                            </button>

                            {/* Credits Section */}
                            <div className="text-center mt-4">
                                <p className="text-black text-6xl">Credits:</p>
                                <p className="text-black text-xl">Development: Chandler</p>
                                <p className="text-black text-xl">Playtesting: Victor</p>
                            </div>
                        </div>

                    )}
                </ModalPanel>
            )}

            <div className="w-full max-w-lg space-y-4 px-2 pt-6 pb-16 mx-auto">
                {businesses.map((biz, index) => (
                    <BusinessCard
                        key={index}
                        business={biz}
                        currency={currency}
                        purchaseAmount={purchaseAmount}
                        progress={progress[index]}
                        onStartProduction={() => handleStartProduction(index)}
                        onBuyBusiness={() => handleBuyBusiness(index)}
                        onClickManager={() => handleClickManager(index)}
                        formatTime={formatTime}
                        nextUnlockMilestone={getNextUnlockMilestone(biz)}
                    />
                ))}
            </div>
            <Footer
                currency={currency}
                purchaseAmount={purchaseAmount}
                onOpenPanel={handleOpenPanel}
                onPurchaseAmountChange={(amount) => setPurchaseAmount(amount)}
                onStartProductionForBusiness={handleStartProductionForBusiness}
                readyBusinessesCount={stableReadyBusinessesCount}
            />
        </div>
    );

};

export default Game;
