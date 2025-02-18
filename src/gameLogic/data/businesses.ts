import { Business } from '../types/business.types.ts';
import {
    burgerUnlocks,
    carsUnlocks,
    convenienceUnlocks,
    pachinkoUnlocks,
    ramenUnlocks,
    sushiUnlocks,
    takoyakiUnlocks,
    tvUnlocks, videoGamesUnlocks,
} from "./unlocks.ts";
import {
    burgerUpgrades,
    carsUpgrades,
    convenienceUpgrades,
    pachinkoUpgrades,
    ramenUpgrades,
    sushiUpgrades,
    takoyakiUpgrades,
    tvUpgrades, videoGamesUpgrades,
} from "./upgrades.ts";

export const businesses: Business[] = [
    new Business("Takoyaki", BigInt(10), BigInt(5), 1.10, 3000, takoyakiUnlocks, 1,
        {
            name: "Rin Hirano",
            cost: BigInt(1000),
            upgrades: takoyakiUpgrades,
            bio: `Growing up in Osaka, she learned the art of crafting perfect takoyaki—mastering the batter, the flip, and the balance of flavors—while working at her family’s beloved street stall. Now, Rin has taken on a leading role, blending traditional techniques with modern twists to attract new customers while honoring her family’s legacy. Her creativity, dedication, and warm personality have made her a standout figure in the local food scene, as she works tirelessly to share her passion for takoyaki and her culture with the world.`
        }
    ),
    new Business("Ramen", BigInt(120), BigInt(30), 1.15, 4500, ramenUnlocks, 0,
        {
            name: "Yui Sasaki",
            cost: BigInt(15000),
            upgrades: ramenUpgrades,
            bio: `With a fiery passion for noodles and broth, this young professional has quickly made a name for herself in the ramen scene. Whether she’s experimenting with new flavor combinations or perfecting the texture of handmade noodles, her dedication to the craft is unmatched. She thrives in the fast-paced kitchen environment, always striving to create bowls that warm the soul and leave customers craving more.`
        }
    ),
    new Business("Burgers", BigInt(1200), BigInt(210), 1.15, 7000, burgerUnlocks, 0,
        {
            name: "Aoi Shimizu",
            cost: BigInt(120000),
            upgrades: burgerUpgrades,
            bio: `A creative force in the world of burgers, she brings a fresh perspective to classic comfort food. From crafting unique sauces to sourcing locally grown ingredients, she’s all about elevating the humble burger into something extraordinary. Her energy and enthusiasm inspire her team, and her love for bold flavors keeps customers coming back for more.`
        }
    ),
    new Business("Sushi", BigInt(18000), BigInt(1470), 1.15, 11000, sushiUnlocks, 0,
        {
            name: "Kaito Tanaka",
            cost: BigInt(600000),
            upgrades: sushiUpgrades,
            bio: `As the manager of a bustling sushi restaurant, he brings precision and passion to every roll. With a keen eye for detail and a deep respect for tradition, he ensures that every piece of sushi is a work of art. His calm demeanor and leadership skills keep the kitchen running smoothly, while his innovative ideas help attract a new generation of sushi lovers.`
        }
    ),
    new Business("Convenience", BigInt(270000), BigInt(7600), 1.15, 18000, convenienceUnlocks, 0,
        {
            name: "Mei Fukuda",
            cost: BigInt(3500000),
            upgrades: convenienceUpgrades,
            bio: `Always on the move, she’s the heart and soul of her local convenience store. Whether she’s organizing shelves, helping customers, or brainstorming new ways to improve the shopping experience, her cheerful attitude and efficiency make her a standout. She takes pride in making the store a welcoming place for everyone who walks through the door.`
        }
    ),
    new Business("Pachinko", BigInt(4050000), BigInt(105840), 1.15, 30000, pachinkoUnlocks, 0,
        {
            name: "Nozomi Hoshino",
            cost: BigInt(55000000),
            upgrades: pachinkoUpgrades,
            bio: `In the vibrant world of pachinko, she’s a rising star. With a knack for understanding the games and a friendly demeanor, she ensures every customer has an exciting experience. Her ability to troubleshoot machines and keep the energy high makes her an invaluable part of the team, and she’s always looking for ways to make the parlor even more fun.`
        }
    ),
    new Business("Video Games", BigInt(81000000), BigInt(1058000), 1.15, 60000, videoGamesUnlocks, 0,
        {
            name: "Nanami Ishikawa",
            cost: BigInt(750000000),
            upgrades: videoGamesUpgrades,
            bio: `A creative mind in the gaming industry, she’s passionate about bringing virtual worlds to life. Whether she’s coding, designing characters, or brainstorming storylines, her innovative ideas and teamwork skills shine. She’s driven by a love for gaming and a desire to create experiences that players will never forget.`
        }
    ),
    new Business("TV", BigInt(1620000000), BigInt(15876000), 1.13, 3600000, tvUnlocks, 0,
        {
            name: "Haruka Fujimoto",
            cost: BigInt(25000000000),
            upgrades: tvUpgrades,
            bio: `In the fast-paced world of television, she’s the glue that holds everything together. From coordinating schedules to assisting on set, her organizational skills and can-do attitude make her an essential part of the team. She’s always eager to learn and brings a fresh perspective to every project she works on.`
        }
    ),
    new Business("Cars", BigInt(24300000000), BigInt(238140000), 1.15, 86400000, carsUnlocks, 0,
        {
            name: "Miyu Nakagawa",
            cost: BigInt(1000000000000),
            upgrades: carsUpgrades,
            bio: `With a love for innovation and problem-solving, she’s making waves in the automotive industry. Whether she’s designing sleek new features or testing the latest technology, her passion for cars drives her to push boundaries. Her attention to detail and forward-thinking mindset make her a key player in shaping the future of transportation.`
        }
    ),
];