import { Manager } from "../../types/manager.types.ts";
import { convenienceUpgrades } from "../upgrades";
import Decimal from "break_infinity.js";

export const convenienceManager = new Manager(
    "Mei Fukuda",
    "福田芽依",
    new Decimal(3500000), // Cost to hire
    convenienceUpgrades, // Associated upgrades
    `Always on the move, she’s the heart and soul of her local convenience store. Whether she’s organizing shelves, helping customers, or brainstorming new ways to improve the shopping experience, her cheerful attitude and efficiency make her a standout. She takes pride in making the store a welcoming place for everyone who walks through the door.` // Bio
);