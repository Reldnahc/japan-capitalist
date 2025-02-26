import { Upgrade } from "../types/manager.types.ts";
import Decimal from "break_infinity.js";

export const takoyakiUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(10000),           effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(5000000),         effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(150000000),       effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(12500000000),     effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(1500000000000),   effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal(500000000000000), effect: "Revenue ×3",  unlocked: false },
];

export const ramenUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(50000),           effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(7250000),         effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(250000000),       effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(32500000000),     effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(4550000000000),   effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal(125000000000000), effect: "Revenue ×3",  unlocked: false },
];

export const burgerUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(1000000),         effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(500000000),       effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(11200000000),     effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(3500000000000),   effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(800000000000000), effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal('12000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const sushiUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(6500000),         effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(320000000),       effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(45000000000),     effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(1200000000000),   effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(250000000000000), effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal('95000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const convenienceUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(22000000),            effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(1500000000),          effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(320000000000),        effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(42000000000000),      effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(8400000000000000),    effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal('200000000000000000'),  effect: "Revenue ×3", unlocked: false },
];

export const pachinkoUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(445000000),          effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(89000000000),        effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(2450000000000),      effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(580000000000000),    effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('15000000000000000'),  effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal('9500000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const videoGamesUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(4500000000),         effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(900000000000),       effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(85000000000000),     effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal(1700000000000000),   effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('850000000000000000'), effect: "Revenue ×2",  unlocked: false },
    { name: "Revenue",    cost: new Decimal('50000000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const tvUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(350000000000),       effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(50000000000000),     effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal(1500000000000000),   effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal('750000000000000000'), effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('50000000000000000000'), effect: "Revenue ×2", unlocked: false },
    { name: "Revenue",    cost: new Decimal('9000000000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const carsUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(10000000000000),       effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal(2500000000000000),     effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('100000000000000000'),   effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal('25000000000000000000'), effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('9000000000000000000000'), effect: "Revenue ×2", unlocked: false },
    { name: "Revenue",    cost: new Decimal('500000000000000000000000'), effect: "Revenue ×3", unlocked: false },
];

export const idolsUpgrades: Upgrade[] = [
    { name: "Efficiency", cost: new Decimal(1000000000000000),       effect: "Speed +100%", unlocked: false },
    { name: "Efficiency", cost: new Decimal('250000000000000000'),     effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('10000000000000000000'),   effect: "Revenue ×2",  unlocked: false },
    { name: "Efficiency", cost: new Decimal('2500000000000000000000'), effect: "Speed +100%", unlocked: false },
    { name: "Revenue",    cost: new Decimal('900000000000000000000000'), effect: "Revenue ×2", unlocked: false },
    { name: "Revenue",    cost: new Decimal('50000000000000000000000000'), effect: "Revenue ×3", unlocked: false },
];