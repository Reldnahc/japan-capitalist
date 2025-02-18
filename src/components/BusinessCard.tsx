// BusinessCard.tsx
import React from 'react';
import {businesses} from "../gameLogic/data/businesses.ts";
import {formatBigIntWithSuffix} from "../utils/formatNumber.ts";
import {SPEED_THRESHOLD} from "../gameLogic/config.ts";

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
}

const BusinessCard: React.FC<BusinessCardProps> = ({business, progress, currency, purchaseAmount, onStartProduction, onBuyBusiness,
                                                       onClickManager, formatTime, nextUnlockMilestone,}) => {

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
                    cost = BigInt(
                        Math.floor(
                            Number(business.baseCost) * Math.pow(business.rate, business.quantity + affordable)
                        )
                    );
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
            currentCost = BigInt(
                Math.floor(
                    Number(business.baseCost) * Math.pow(business.rate, business.quantity + i + 1)
                )
            );
        }

        return { totalCost, quantityToBuy };
    };

    const { totalCost, quantityToBuy } = calculateTotalPrice();
    const isButtonDisabled = totalCost > currency;

    return (
        <div className="flex items-center">
            {/* Start Production Button */}
            <button
                onClick={onStartProduction}
                disabled={business.isProducing || (business.manager && business.manager.hired) || business.quantity === 0}
                className={`relative w-20 h-20 bg-gray-200 flex items-center justify-center mr-4 rounded-full transition-all duration-300 focus:outline-none ${
                    !(business.isProducing || (business.manager && business.manager.hired) || business.quantity === 0)
                        ? "ring-4 ring-yellow-400 animate-glow"
                        : "opacity-50 cursor-not-allowed"
                }`}
                style={{
                    backgroundImage: `url(/japan-capitalist/images/icons/${business.name.toLowerCase()}.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <span className="absolute -top-0 left-1/2 transform -translate-x-1/2 font-bold text-xs text-black text-nowrap">{business.name}</span>
                {/* Quantity and Next Unlock */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 text-nowrap bg-black bg-opacity-60 rounded text-white text-xs font-semibold">
                    {business.quantity} / {nextUnlockMilestone || "-"}
                </div>
            </button>

            {/* Business Info Card */}
            <div className="flex-1  rounded-lg h-20 px-1 py-2 flex flex-col justify-between relative">
                {/* Progress Bar */}
                <div className="w-full bg-gray-300 h-10 rounded-b-sm overflow-hidden mb-1">
                    <div
                        key={business.isProducing ? "producing" : "reset"}
                        className={`h-full ${business.productionTime <= SPEED_THRESHOLD && business.manager?.hired ? "bg-yellow-400" : "bg-green-500"} flex items-center`}
                        style={{
                            width: !business.isProducing ? "0%" : business.productionTime <= SPEED_THRESHOLD && business.manager?.hired ? "100%" : `${progress}%`,
                            transition: business.isProducing ? "width 0.1s linear" : "none",
                        }}
                    >
                        <span className="text-nowrap text-xl ml-6 text-black font-fredoka">
                            {business.productionTime <= SPEED_THRESHOLD && business.manager?.hired && business.revenuePerSecond ? `¥${formatBigIntWithSuffix(business.revenuePerSecond)}/sec` : `¥${formatBigIntWithSuffix(business.revenue * BigInt(business.quantity))}`}

                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between text-xs">
                    {/* Buy Button */}
                    <div className="flex">
                        <button
                            onClick={onBuyBusiness}
                            disabled={isButtonDisabled} // Disable button if totalPrice > currency
                            className={`px-2 py-1 rounded text-xs ${
                                isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                            {purchaseAmount === "max" || purchaseAmount === "next" ? `${quantityToBuy} x` : purchaseAmount} ¥{formatBigIntWithSuffix(totalCost)}
                        </button>
                    </div>

                    {/* Manager Button and Timer Aligned to the Right */}
                    <div className="flex items-center space-x-1 ml-auto">
                        {business.manager && (
                            <button
                                onClick={onClickManager}
                                className="relative flex justify-center items-center bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 64 64"
                                    width="15"
                                    height="15"
                                    fill="black"
                                    stroke="black"
                                    strokeWidth="2"
                                    className="my-auto"
                                >
                                    <circle cx="32" cy="20" r="12" />
                                    <path d="M16,48 a16,16 0 0,1 32,0" />
                                </svg>
                                { !business.manager.hired && currency >= business.manager.cost && (
                                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-black font-bold text-md w-3 h-3 flex items-center justify-center rounded-full">
                                    !
                                    </span>
                                )}

                            </button>
                        )}

                        {/* Timer */}
                        <div className="text-xs min-w-16 text-center text-gray-800 bg-white bg-opacity-80 px-2 py-1 rounded">
                            {business.isProducing
                                ? formatTime(Math.max(Math.floor((business.endTime - Date.now()) / 1000), 0))
                                : formatTime(Math.floor(business.productionTime / 1000))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;