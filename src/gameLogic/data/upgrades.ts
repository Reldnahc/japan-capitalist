import {Upgrade} from "../types/manager.types.ts";

export const takoyakiUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(10000), effect: "Speed +100%", applied: false,},
    { name: "Revenue", cost: BigInt(150000), effect: "Revenue ×3", applied: false,},
    { name: "Revenue", cost: BigInt(1250000), effect: "Revenue ×2", applied: false,},
    { name: "Revenue", cost: BigInt(15000000000), effect: "Revenue ×3", applied: false,},
];

export const ramenUpgrades: Upgrade[] = [
    { name: "Revenue", cost: BigInt(50000), effect: "Revenue ×2", applied: false,},
    { name: "Revenue", cost: BigInt(500000), effect: "Revenue ×2", applied: false,},
];

export const burgerUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(500000), effect: "Speed +50%", applied: false,},
    { name: "Revenue", cost: BigInt(1750000), effect: "Revenue ×2", applied: false,},
];

export const sushiUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(125000), effect: "Speed +50%", applied: false,},
    { name: "Revenue", cost: BigInt(25000000), effect: "Revenue ×2", applied: false,},
];

export const convenienceUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(500000), effect: "Speed +50%", applied: false },
    { name: "Revenue", cost: BigInt(900000), effect: "Revenue ×2", applied: false },
];

export const pachinkoUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(1100000), effect: "Speed +50%", applied: false },
    { name: "Revenue", cost: BigInt(2300000), effect: "Revenue ×2", applied: false },
];

export const videoGamesUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: BigInt(7000000), effect: "Speed +50%", applied: false },
    { name: "Revenue", cost: BigInt(15000000), effect: "Revenue ×2", applied: false },
];

export const tvUpgrades: Upgrade[] = [];

export const carsUpgrades: Upgrade[] = [];
