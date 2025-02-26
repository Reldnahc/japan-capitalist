import { Manager } from "../../types/manager.types.ts";
import { videoGamesUpgrades } from "../upgrades";
import Decimal from "break_infinity.js";

export const videoGamesManager = new Manager(
    "Nami Ishikawa",
    "石川奈美",
    new Decimal(750000000), // Cost to hire
    videoGamesUpgrades, // Associated upgrades
    `A creative mind in the gaming industry, she’s passionate about bringing virtual worlds to life. Whether she’s coding, designing characters, or brainstorming storylines, her innovative ideas and teamwork skills shine. She’s driven by a love for gaming and a desire to create experiences that players will never forget.` // Bio
);