import React from "react";
import { Business } from "../../gameLogic/types/business.types";
import { formatDecimalWithSuffix } from "../../utils/formatNumber.ts";
import Decimal from "break_infinity.js";

type ManagerDetailsPanelProps = {
    selectedBusiness: Business;
    businesses: Business[];
    onHireManager: (index: number) => void;
    onManagerUpgrade: (businessIndex: number, upgradeIndex: number) => void;
    currency: Decimal;
};

const ManagerDetailsPanel: React.FC<ManagerDetailsPanelProps> = ({
    selectedBusiness,
    businesses,
    onHireManager,
    onManagerUpgrade,
    currency,
}) => {
    return (
        <div
            className="relative flex flex-col h-[70vh] max-w-md pt-8 mx-auto px-3 rounded-lg"
        >
            <div className="text-center">
                <img
                    src={`/japan-capitalist/images/businesses/${selectedBusiness.name
                        .toLowerCase()
                        .replace(" ", "")}/employee.webp`}
                    alt={selectedBusiness.name}
                    className=" object-contain rounded -mt-6"
                />
                <div className="border-gray-500 border-2 rounded-lg px-4 mt-4 bg-gray-800 bg-opacity-80">
                    <p className="text-2xl text-white mt-3 mb-2 font-fredoka">
                        {selectedBusiness.manager?.name} -
                        <span className="font-yuji">{selectedBusiness.manager?.kanji}</span>
                    </p>
                    {selectedBusiness.manager?.bio && (
                        <p className="text-base md:text-lg text-gray-50 italic mb-6 text-left">
                            "{selectedBusiness.manager.bio}"
                        </p>
                    )}
                </div>
                {selectedBusiness.manager?.hired ? (
                    <div className="mt-4">
                        <h4 className="text-3xl text-gray-50 font-semibold mb-3">Upgrades</h4>
                        <div className="space-y-2 pb-8">
                            {selectedBusiness.manager.upgrades?.map((upgrade, idx) => (
                                <div
                                    key={idx}
                                    className={`flex justify-between items-center px-4 py-2 rounded-md ${
                                        upgrade.unlocked ? "bg-green-100 opacity-30" : "bg-gray-300"
                                    }`}
                                >
                                    <span className=" text-sm md:text-base text-gray-800 font-bold w-32">{upgrade.effect}</span>
                                    <span className="text-gray-800 text-sm md:text-lg w-full ml-6  text-left">
                                        ¥{formatDecimalWithSuffix(upgrade.cost)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const businessIndex =
                                                businesses.findIndex(
                                                    (b) =>
                                                        b.name ===
                                                        selectedBusiness.name
                                                );
                                            if (businessIndex >= 0) {
                                                onManagerUpgrade(
                                                    businessIndex,
                                                    idx
                                                );
                                            }
                                        }}
                                        disabled={
                                            upgrade.unlocked ||
                                            currency < upgrade.cost
                                        }
                                        className={`relative px-1 py-1 text-xs md:text-lg rounded w-20 md:w-28 flex  justify-center items-center ${
                                            upgrade.unlocked
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : currency < upgrade.cost
                                                    ? "bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed"
                                                    : "bg-gold-gradient text-white hover:brightness-120 animate-gold-glow shadow-gold-outer"
                                        }`}
                                        style={{
                                            backgroundSize:
                                                "300% 300%",
                                        }}
                                    >
                                        {!upgrade.unlocked &&
                                            currency >=
                                            upgrade.cost && (
                                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/50 to-white/10 opacity-0 hover:opacity-75 animate-shine pointer-events-none" />
                                            )}

                                        <span
                                            className={`text-sm md:text-base font-extrabold ${
                                                upgrade.unlocked
                                                    ? ""
                                                    : currency <
                                                    upgrade.cost
                                                        ? ""
                                                        : "[text-shadow:0px_1px_2px_rgba(255,215,0,0.9),0px_3px_5px_rgba(0,0,0,0.8)]"
                                            }`}
                                        >
                                                            {upgrade.unlocked
                                                                ? "Bought"
                                                                : "Buy"}
                                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <button
                        className="mt-3 bg-green-500 text-white px-4 py-2 mb-6 rounded hover:bg-green-600 focus:outline-none"
                        onClick={() => {
                            const index = businesses.findIndex(
                                (business) => business.name === selectedBusiness.name
                            );
                            if (index >= 0) {
                                onHireManager(index);
                            }
                        }}
                    >
                        Hire for ¥{formatDecimalWithSuffix(selectedBusiness.manager?.cost || new Decimal(0))}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ManagerDetailsPanel;