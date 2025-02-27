import {Manager} from "../types/manager.types.ts";
import Decimal from "break_infinity.js";
import {
    burgerUpgrades,
    carsUpgrades,
    convenienceUpgrades,
    idolsUpgrades,
    pachinkoUpgrades,
    ramenUpgrades, sushiUpgrades, takoyakiUpgrades, tvUpgrades, videoGamesUpgrades
} from "./upgrades.ts";

export const takoyakiManager = new Manager(
    "Rin Hirano",
    "平野凛",
    new Decimal(1000), // Cost to hire
    takoyakiUpgrades, // Associated upgrades
    `Growing up in Osaka, she learned the art of crafting perfect takoyaki—mastering the batter, the flip, and the balance of flavors—while working at her family’s beloved street stall. Now, Rin has taken on a leading role, blending traditional techniques with modern twists to attract new customers while honoring her family’s legacy. Her creativity, dedication, and warm personality have made her a standout figure in the local food scene, as she works tirelessly to share her passion for takoyaki and her culture with the world.` // Bio
);

export const burgerManager = new Manager(
    "Aoi Shimizu",
    "清水葵",
    new Decimal(120000),
    burgerUpgrades,
    `A creative force in the world of burgers, she brings a fresh perspective to classic comfort food. From crafting unique sauces to sourcing locally grown ingredients, she’s all about elevating the humble burger into something extraordinary. Her energy and enthusiasm inspire her team, and her love for bold flavors keeps customers coming back for more.`
);

export const ramenManager = new Manager(
    "Yui Sasaki",
    "佐々木結衣",
    new Decimal(15000), // Cost to hire
    ramenUpgrades, // Associated upgrades
    `With a fiery passion for noodles and broth, this young professional has quickly made a name for herself in the ramen scene. Whether she’s experimenting with new flavor combinations or perfecting the texture of handmade noodles, her dedication to the craft is unmatched. She thrives in the fast-paced kitchen environment, always striving to create bowls that warm the soul and leave customers craving more.` // Bio
);

export const sushiManager = new Manager(
    "Mitsuki Komori",
    "小森美月",
    new Decimal(600000), // Cost to hire
    sushiUpgrades, // Associated upgrades
    `As the manager of a bustling sushi restaurant, she brings precision and passion to every roll. With a keen eye for detail and a deep respect for tradition, she ensures that every piece of sushi is a work of art. Her calm demeanor and leadership skills keep the kitchen running smoothly, while her innovative ideas help attract a new generation of sushi lovers.` // Bio
);

export const convenienceManager = new Manager(
    "Mei Fukuda",
    "福田芽依",
    new Decimal(5500000), // Cost to hire
    convenienceUpgrades, // Associated upgrades
    `Always on the move, she’s the heart and soul of her local convenience store. Whether she’s organizing shelves, helping customers, or brainstorming new ways to improve the shopping experience, her cheerful attitude and efficiency make her a standout. She takes pride in making the store a welcoming place for everyone who walks through the door.` // Bio
);

export const pachinkoManager = new Manager(
    "Nozomi Hoshino",
    "星野望",
    new Decimal(55000000), // Cost to hire
    pachinkoUpgrades, // Associated upgrades
    `In the vibrant world of pachinko, she’s a rising star. With a knack for understanding the games and a friendly demeanor, she ensures every customer has an exciting experience. Her ability to troubleshoot machines and keep the energy high makes her an invaluable part of the team, and she’s always looking for ways to make the parlor even more fun.` // Bio
);

export const videoGamesManager = new Manager(
    "Nami Ishikawa",
    "石川奈美",
    new Decimal(750000000), // Cost to hire
    videoGamesUpgrades, // Associated upgrades
    `A creative mind in the gaming industry, she’s passionate about bringing virtual worlds to life. Whether she’s coding, designing characters, or brainstorming storylines, her innovative ideas and teamwork skills shine. She’s driven by a love for gaming and a desire to create experiences that players will never forget.` // Bio
);

export const tvManager = new Manager(
    "Haruka Fujimoto",
    "藤本遥",
    new Decimal(25000000000), // Cost to hire
    tvUpgrades, // Associated upgrades
    `In the fast-paced world of television, she’s the glue that holds everything together. From coordinating schedules to assisting on set, her organizational skills and can-do attitude make her an essential part of the team. She’s always eager to learn and brings a fresh perspective to every project she works on.` // Bio
);

export const carsManager = new Manager(
    "Miyu Nakagawa",
    "中川美優",
    new Decimal(1000000000000), // Cost to hire
    carsUpgrades, // Upgrades tied to the manager
    `With a love for innovation and problem-solving, she’s making waves in the automotive industry. Whether she’s designing sleek new features or testing the latest technology, her passion for cars drives her to push boundaries. Her attention to detail and forward-thinking mindset make her a key player in shaping the future of transportation.` // Bio
);

export const idolsManager = new Manager(
    "Yuna Sakuraba",
    "桜庭優奈",
    new Decimal(125000000000000), // Cost to hire
    idolsUpgrades, // Associated upgrades
    `With a keen eye for talent and an unwavering dedication to the industry, she ensures every performance runs flawlessly. From managing schedules to mentoring rising stars, her leadership keeps the team focused and thriving. Always calm under pressure, she works tirelessly behind the scenes to help idols shine on stage.` // Bio
);