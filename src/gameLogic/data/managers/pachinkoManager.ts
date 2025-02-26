import { Manager } from "../../types/manager.types.ts";
import { pachinkoUpgrades } from "../upgrades";
import Decimal from "break_infinity.js";

export const pachinkoManager = new Manager(
    "Nozomi Hoshino",
    "星野望",
    new Decimal(55000000), // Cost to hire
    pachinkoUpgrades, // Associated upgrades
    `In the vibrant world of pachinko, she’s a rising star. With a knack for understanding the games and a friendly demeanor, she ensures every customer has an exciting experience. Her ability to troubleshoot machines and keep the energy high makes her an invaluable part of the team, and she’s always looking for ways to make the parlor even more fun.` // Bio
);