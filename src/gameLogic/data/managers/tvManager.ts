import { Manager } from "../../types/manager.types.ts";
import { tvUpgrades } from "../upgrades";
import Decimal from "break_infinity.js";

export const tvManager = new Manager(
    "Haruka Fujimoto",
    "藤本遥",
    new Decimal(25000000000), // Cost to hire
    tvUpgrades, // Associated upgrades
    `In the fast-paced world of television, she’s the glue that holds everything together. From coordinating schedules to assisting on set, her organizational skills and can-do attitude make her an essential part of the team. She’s always eager to learn and brings a fresh perspective to every project she works on.` // Bio
);