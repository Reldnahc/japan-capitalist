import { Manager } from "../../types/manager.types.ts";
import { sushiUpgrades } from "../upgrades";

export const sushiManager = new Manager(
    "Mitsuki Komori",
    "小森美月",
    BigInt(600000), // Cost to hire
    sushiUpgrades, // Associated upgrades
    `As the manager of a bustling sushi restaurant, she brings precision and passion to every roll. With a keen eye for detail and a deep respect for tradition, she ensures that every piece of sushi is a work of art. Her calm demeanor and leadership skills keep the kitchen running smoothly, while her innovative ideas help attract a new generation of sushi lovers.` // Bio
);