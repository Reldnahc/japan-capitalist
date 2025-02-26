import { Manager } from "../../types/manager.types.ts";
import { idolsUpgrades } from "../upgrades";
import Decimal from "break_infinity.js";

export const idolsManager = new Manager(
    "Yuna Sakuraba",
    "桜庭優奈",
    new Decimal(125000000000000), // Cost to hire
    idolsUpgrades, // Associated upgrades
    `With a keen eye for talent and an unwavering dedication to the industry, she ensures every performance runs flawlessly. From managing schedules to mentoring rising stars, her leadership keeps the team focused and thriving. Always calm under pressure, she works tirelessly behind the scenes to help idols shine on stage.` // Bio
);