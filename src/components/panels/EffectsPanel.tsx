import React from "react";
import {IdleGame} from "../../gameLogic/idleGame.ts";

interface EffectsPanelProps {
  game: IdleGame; // Replace `any` with proper type for your `game` object
  items: {
    id: string;
    name: string;
    quantity: number;
  }[]; // Replace with the accurate type for `items`
  setIsTimeBoostAlertOpen: (open: boolean) => void;
  formatTime: (seconds: number) => string;
  handleItem: (itemId: string) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  game,
  items,
  setIsTimeBoostAlertOpen,
  formatTime,
  handleItem,
}) => {
  return (
    <div className="h-[70vh] overflow-y-auto overflow-x-hidden px-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
      <div className="border-gray-500 border-2 rounded-lg p-4 mt-4 bg-gray-800 bg-opacity-80 flex flex-col items-center">

        {/* Page Description */}
        <p className="text-gray-300 text-center mb-6 md:text-xl">
          Trigger a time warp to travel 30 minutes into the future! Use the WARP! button when available to gain massive rewards.
        </p>

        {/* Big WARP! Button with Cooldown Inside */}
        <button
          className={`relative w-48 h-48 md:w-80 md:h-80 md:text-7xl flex items-center justify-center rounded-full 
            ${game.isBoostAvailable() ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 cursor-not-allowed"} 
            text-white text-2xl font-bold active:scale-95 transition-transform`}
          onClick={() => {
            if (game.isBoostAvailable()) {
              game.triggerBoost();
              setIsTimeBoostAlertOpen(true);
            }
          }}
          disabled={!game.isBoostAvailable()}
        >
          WARP!
          {!game.isBoostAvailable() && (
            <span className="absolute bottom-8 md:bottom-20 text-sm font-medium md:text-2xl">
              {formatTime(Math.ceil(game.boostCooldownRemaining() / 1000))}
            </span>
          )}
        </button>

        {/* Items Header */}
        <h2 className="mt-8 text-xl font-bold text-gray-300">Items</h2>
        <ul className="grid grid-cols-3 gap-4 mt-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="relative flex flex-col items-center bg-gray-800 rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 active:scale-95"
            >
              {/* Button wrapping the content */}
              <button
                className="relative flex flex-col items-center focus:outline-none"
                onClick={() => handleItem(item.id)}
              >
                {/* SVG Placeholder with Quantity Badge */}
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-gray-300"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25a.75.75 0 01.75.75v8.19l4.72 4.73a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 01-.22-.53V3a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-1.5 0a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {/* Quantity Badge */}
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-800">
                    {item.quantity}
                  </div>
                </div>

                {/* Item Name */}
                <div className="mt-2 text-center text-gray-300 text-sm font-medium">
                  {item.name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EffectsPanel;