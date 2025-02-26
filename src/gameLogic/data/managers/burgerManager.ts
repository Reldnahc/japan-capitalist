import { burgerUpgrades } from "../upgrades";
import {Manager} from "../../types/manager.types.ts";
import Decimal from "break_infinity.js";

export const burgerManager = new Manager(
    "Aoi Shimizu",
    "清水葵",
    new Decimal(120000),
    burgerUpgrades,
    `A creative force in the world of burgers, she brings a fresh perspective to classic comfort food. From crafting unique sauces to sourcing locally grown ingredients, she’s all about elevating the humble burger into something extraordinary. Her energy and enthusiasm inspire her team, and her love for bold flavors keeps customers coming back for more.`
);