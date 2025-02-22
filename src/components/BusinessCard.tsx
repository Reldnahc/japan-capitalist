// BusinessCard.tsx
import React from 'react';
import {businesses} from "../gameLogic/data/businesses.ts";
import {formatBigIntWithSuffix} from "../utils/formatNumber.ts";
import {SPEED_THRESHOLD} from "../gameLogic/config.ts";
import {calculateCost} from "../utils/calculateCost.ts";

interface BusinessCardProps {
    business: typeof businesses[number];
    progress: number;
    currency: bigint;
    purchaseAmount: string;
    onStartProduction: () => void;
    onBuyBusiness: () => void;
    onClickManager: () => void;
    formatTime: (seconds: number) => string;
    nextUnlockMilestone: number;
    onBuyOneBusiness: () => void;
    fans: bigint;
}

const BusinessCard: React.FC<BusinessCardProps> = ({business, progress, currency, purchaseAmount, onStartProduction, onBuyBusiness,
                                                       onClickManager, formatTime, nextUnlockMilestone, onBuyOneBusiness, fans}) => {

    const calculateTotalPrice = (): { totalCost: bigint, quantityToBuy: number } => {
        let quantityToBuy = 1; // Default to 1
        switch (purchaseAmount) {
            case "x5":
                quantityToBuy = 5;
                break;
            case "x10":
                quantityToBuy = 10;
                break;
            case "x100":
                quantityToBuy = 100;
                break;
            case "next":
                quantityToBuy = Math.max(1, nextUnlockMilestone - business.quantity); // For "next" milestone
                break;
            case "max": {
                let tempCurrency = currency;
                let cost = business.cost;
                let affordable = 0;
                while (tempCurrency >= cost) {
                    tempCurrency -= cost;
                    affordable++;
                    cost = calculateCost(business.baseCost, business.rate, business.quantity + affordable);
                }
                quantityToBuy = affordable;
                if (quantityToBuy === 0) {
                    quantityToBuy = 1;
                }
                break;
            }
            default:
                quantityToBuy = 1;
                break;
        }

        // Calculate the total cost for quantityToBuy
        let totalCost = BigInt(0);
        let currentCost = business.cost;

        for (let i = 0; i < quantityToBuy; i++) {
            totalCost += currentCost;
            currentCost = calculateCost(business.baseCost, business.rate, business.quantity + i + 1);
        }

        return { totalCost, quantityToBuy };
    };

    const getVisualEffects = () => {
        const effects = {
            showLightning: false
        };

        if (adjustedRevenuePerSecond >= 1_000_000_000_000_000n) {
            effects.showLightning = true;
        }

        return effects;
    };

    const getProgressBarColor = (): string => {
        if (business.productionTime >= SPEED_THRESHOLD) {
            return "hsl(120, 70%, 55%)"; // Calm green
        }

        const ONE_MILLION = 1_000_000n;
        const ONE_BILLION = 1_000_000_000n;
        const ONE_TRILLION = 1_000_000_000_000n;

        if (adjustedRevenuePerSecond < ONE_MILLION) {
            return "hsl(55, 85%, 60%)"; // Warm yellow
        }

        if (adjustedRevenuePerSecond < ONE_BILLION) {
            // Yellow to orange transition (1M to 1B)
            const ratio = Number(adjustedRevenuePerSecond - ONE_MILLION) / Number(ONE_BILLION - ONE_MILLION);
            const eased = Math.pow(ratio, 0.6); // Fast initial transition

            const hue = 55 - (eased * 25); // 55° (yellow) → 30° (orange)
            return `hsl(${hue}, 85%, 60%)`;
        }

        if (adjustedRevenuePerSecond < ONE_TRILLION) {
            // Orange to red transition (1B to 1T)
            const ratio = Number(adjustedRevenuePerSecond - ONE_BILLION) / Number(ONE_TRILLION - ONE_BILLION);
            const eased = Math.pow(ratio, 0.4); // Slow final transition

            const hue = 30 - (eased * 30); // 30° (orange) → 0° (red)
            return `hsl(${hue}, ${85 - (ratio * 15)}%, ${60 - (ratio * 5)}%)`;
        }

        return "hsl(0, 70%, 55%)"; // Muted red
    };

    const { totalCost, quantityToBuy } = calculateTotalPrice();
    const isButtonDisabled = totalCost > currency;
    const FAN_MULTIPLIER_SCALE = 100n; // Assume scaling in BigInt
    const fanMultiplier = FAN_MULTIPLIER_SCALE + fans;
    let adjustedRevenuePerSecond = 0n;
    if (business.revenuePerSecond){
        adjustedRevenuePerSecond = (business.revenuePerSecond * fanMultiplier) / FAN_MULTIPLIER_SCALE;
    }
    const adjustedRevenue = (business.revenue * BigInt(business.quantity) * fanMultiplier) / FAN_MULTIPLIER_SCALE;


    const canAffordManagerUpgrade = () => {
        for (const upgrade of business.manager?.upgrades || []) { // Iterate over upgrades
            if (upgrade.cost <= currency && upgrade.unlocked === false) {
                return true; // Stop execution and return true if condition is met
            }
        }
        return false; // Return false if none of the upgrades meet the condition
    };



    return (
        <div className="flex items-center border-2  border-gray-500 px-2 py-1 rounded-md bg-gray-800 bg-opacity-40">
            {/* Start Production Button */}
            <div className="">
                <button
                    onClick={onStartProduction}
                    disabled={business.isProducing || (business.manager && business.manager.hired) || business.quantity === 0}
                    className={`relative w-20 h-20 md:w-28 md:h-28 bg-gray-200 flex items-center ring-4 ring-gray-800 justify-center mr-4 rounded-full transition-all duration-300 focus:outline-none ${
                        !(business.isProducing || (business.manager && business.manager.hired) || business.quantity === 0)
                            ? "ring-4 ring-yellow-400 animate-glow"
                            : " cursor-not-allowed"
                    }`}
                    style={{
                        backgroundImage: `url(/japan-capitalist/images/businesses/${business.name.toLowerCase().replace(" ","")}/icon.webp)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 font-bold text-base md:text-lg text-black text-shadow-white-outline text-nowrap">{business.name}</span>
                    {/* Quantity and Next Unlock */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 text-nowrap bg-black bg-opacity-60 rounded text-white text-xs md:text-sm font-semibold">
                        {business.quantity} / {nextUnlockMilestone || "-"}
                    </div>
                </button>
            </div>

            {/* Business Info Card (conditionally rendered) */}
            {business.quantity > 0 ? (
                <div className=" flex-1 rounded-lg h-24 px-1 py-1 md:py-0 flex flex-col justify-between relative">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 h-12 md:h-14 rounded-b-sm overflow-hidden mb-1 relative">
                        {/* Add effects container */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Lightning Effect */}
                            {getVisualEffects().showLightning && (
                                <svg
                                    className="absolute inset-0 w-full h-full animate-lightningFlash z-20"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0,50 L20,30 L40,70 L60,40 L80,60 L100,50"
                                        stroke="yellow"
                                        strokeWidth="10"
                                        fill="none"
                                        strokeLinecap="round"
                                        opacity="0.7"
                                    />
                                </svg>
                            )}

                        </div>
                        {/* Text Outside the Bar */}
                        <span
                            className="text-nowrap text-xl ml-6 text-black font-fredoka absolute top-1/2 transform -translate-y-1/2 z-20"
                        >
                            {business.productionTime <= SPEED_THRESHOLD &&
                            business.manager?.hired &&
                            business.revenuePerSecond
                                ? `¥${formatBigIntWithSuffix(adjustedRevenuePerSecond)}/sec`
                                : `¥${formatBigIntWithSuffix(adjustedRevenue)}`
                            }
                        </span>

                        {/* Progress Bar */}
                        <div
                            key={business.isProducing ? "producing" : "reset"}
                            className={`h-full flex w-full items-center transition-transform duration-0`}
                            style={{
                                backgroundColor: getProgressBarColor(),
                                transform: !business.isProducing
                                    ? "translateX(-100%)"
                                    : business.productionTime <= SPEED_THRESHOLD && business.manager?.hired
                                        ? "translateX(0)"
                                        : `translateX(${progress - 100}%)`,
                            }}
                        ></div>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex items-center justify-between">
                        {/* Buy Button */}
                        <div className="flex flex-1">
                            <button
                                onClick={onBuyBusiness}
                                disabled={isButtonDisabled}
                                className={`relative w-full mr-1 px-2 py-1 rounded h-8 md:h-10 text-xs md:text-base flex flex-col items-center justify-center leading-none overflow-hidden ${
                                    isButtonDisabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gold-gradient text-white cursor-pointer hover:brightness-120 animate-gold-glow shadow-gold-outer"
                                }`}
                                style={{
                                    backgroundSize: '300% 300%',
                                }}
                            >
                                {/* Shine Animation Overlay */}
                                {!isButtonDisabled && (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/50 to-white/10 opacity-0 hover:opacity-75 animate-shine pointer-events-none" />
                                )}

                                {/* Button Text */}
                                <span
                                    className={`text-sm md:text-base font-extrabold ${
                                        !isButtonDisabled
                                            ? "[text-shadow:0px_1px_2px_rgba(255,215,0,0.9),0px_3px_5px_rgba(0,0,0,0.8)]"
                                            : ""
                                    }`}
                                >
                                    Buy x{quantityToBuy}
                                </span>
                                <span
                                    className={`text-sm md:text-base -mt-1.5 ${
                                        !isButtonDisabled
                                            ? "[text-shadow:0px_1px_2px_rgba(255,215,0,0.9),0px_3px_5px_rgba(0,0,0,0.8)]"
                                            : ""
                                    }`}
                                >
                                ¥{formatBigIntWithSuffix(totalCost, 1)}
                            </span>
                            </button>
                        </div>

                        {/* Manager Button and Timer */}
                        <div className="flex items-center space-x-1 ml-auto">
                            {business.manager && (
                                <button
                                    onClick={onClickManager}
                                    className="relative flex justify-center items-center h-8 md:h-10 w-8 md:w-10 bg-blue-500 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 64 64"
                                        width="25"
                                        height="25"
                                        fill="black"
                                        stroke="black"
                                        strokeWidth="2"
                                        className="block"
                                    >
                                        <circle cx="32" cy="20" r="12" />
                                        <path d="M16,48 a16,16 0 0,1 32,0" />
                                    </svg>
                                    { ((!business.manager.hired && currency >= business.manager.cost) || canAffordManagerUpgrade()) && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black font-bold text-md w-4 h-4 flex items-center justify-center rounded-full">
                                            !
                                        </span>
                                    )}
                                </button>
                            )}

                            <div className="flex items-center justify-center text-xs md:text-sm min-w-16 md:min-w-20  h-8 md:h-10 text-center text-gray-800 bg-gray-300 px-2 py-1 rounded">
                                {business.isProducing
                                    ? formatTime(
                                        Math.max(
                                            Math.floor((business.endTime - Date.now()) / 1000),
                                            0
                                        )
                                    )
                                    : formatTime(
                                        Math.floor(business.productionTime / 1000)
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Unowned Business Section (alternate content for unowned business)
                <div className="flex-1 flex flex-col justify-center items-center text-center rounded-lg h-24">
                    <button
                        onClick={onBuyOneBusiness}
                        disabled={currency < business.cost}
                        className={`px-4 py-2 rounded-md w-full h-full ${
                            currency < business.cost
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                        Buy for ¥{formatBigIntWithSuffix(business.cost)}
                    </button>
                </div>
            )}

        </div>
    );
};

export default BusinessCard;