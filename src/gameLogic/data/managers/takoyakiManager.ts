import { Manager } from "../../types/manager.types.ts";
import { takoyakiUpgrades } from "../upgrades";

export const takoyakiManager = new Manager(
    "Rin Hirano",
    "平野凛",
    BigInt(1000), // Cost to hire
    takoyakiUpgrades, // Associated upgrades
    `Growing up in Osaka, she learned the art of crafting perfect takoyaki—mastering the batter, the flip, and the balance of flavors—while working at her family’s beloved street stall. Now, Rin has taken on a leading role, blending traditional techniques with modern twists to attract new customers while honoring her family’s legacy. Her creativity, dedication, and warm personality have made her a standout figure in the local food scene, as she works tirelessly to share her passion for takoyaki and her culture with the world.` // Bio
);