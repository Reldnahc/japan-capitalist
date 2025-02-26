import { carsUpgrades } from "../upgrades";
import {Manager} from "../../types/manager.types.ts";
import Decimal from "break_infinity.js";

export const carsManager = new Manager(
    "Miyu Nakagawa",
    "中川美優",
    new Decimal(1000000000000), // Cost to hire
    carsUpgrades, // Upgrades tied to the manager
    `With a love for innovation and problem-solving, she’s making waves in the automotive industry. Whether she’s designing sleek new features or testing the latest technology, her passion for cars drives her to push boundaries. Her attention to detail and forward-thinking mindset make her a key player in shaping the future of transportation.` // Bio
);