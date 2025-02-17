import { Business } from './types/business.types';

// Default businesses data
export const businesses: Business[] = [
    {
        name: "Takoyaki",
        cost: BigInt(10),
        baseCost: BigInt(10),
        revenue: BigInt(5),
        baseRevenue: BigInt(5),
        quantity: 1,
        rate: 1.10,
        productionTime: 3000,
        baseProductionTime: 3000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
            { milestone: 50, effect: "Revenue ×4", applied: false },
            { milestone: 75, effect: "Speed +50%", applied: false },
            { milestone: 100, effect: "Revenue ×5", applied: false },
            { milestone: 150, effect: "Speed +100%", applied: false },
            { milestone: 200, effect: "Speed +50%", applied: false },
            { milestone: 250, effect: "Revenue ×2", applied: false },
            { milestone: 300, effect: "Revenue ×3", applied: false },
            { milestone: 350, effect: "Speed +50%", applied: false },
            { milestone: 400, effect: "Revenue ×2", applied: false },
            { milestone: 500, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Rin Hirano",
            cost: BigInt(1000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(10000), effect: "Speed +100%", applied: false,},
                { name: "Revenue", cost: BigInt(150000), effect: "Revenue ×3", applied: false,},
                { name: "Revenue", cost: BigInt(1250000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `Growing up in Osaka, she learned the art of crafting perfect takoyaki—mastering the batter,
             the flip, and the balance of flavors—while working at her family’s beloved street stall. Now,
              Rin has taken on a leading role, blending traditional techniques with modern twists to attract
               new customers while honoring her family’s legacy. Her creativity, dedication, and warm personality
                have made her a standout figure in the local food scene, as she works tirelessly to share her passion
                 for takoyaki and her culture with the world.`
        }
    },
    {
        name: "Ramen",
        cost: BigInt(120),
        baseCost: BigInt(120),
        revenue: BigInt(30),
        baseRevenue: BigInt(30),
        quantity: 0,
        rate: 1.15,
        productionTime: 4500,
        baseProductionTime: 4500,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
            { milestone: 75, effect: "Revenue ×4", applied: false },
            { milestone: 150, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Yui Sasaki",
            cost: BigInt(15000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(10000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(50000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `With a fiery passion for noodles and broth, this young professional has quickly made a name for herself in the ramen scene. Whether she’s experimenting with new flavor combinations or perfecting the texture of handmade noodles, her dedication to the craft is unmatched. She thrives in the fast-paced kitchen environment, always striving to create bowls that warm the soul and leave customers craving more.`
        }
    },
    {
        name: "Burgers",
        cost: BigInt(1200),
        baseCost: BigInt(1200),
        revenue: BigInt(210),
        baseRevenue: BigInt(210),
        quantity: 0,
        rate: 1.15,
        productionTime: 7000,
        baseProductionTime: 7000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
            { milestone: 50, effect: "Revenue ×3", applied: false },
            { milestone: 75, effect: "Speed +100%", applied: false },
            { milestone: 100, effect: "Revenue ×2", applied: false },
            { milestone: 150, effect: "Revenue ×2", applied: false },
            { milestone: 200, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Aoi Shimizu",
            cost: BigInt(120000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(500000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(1750000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `A creative force in the world of burgers, she brings a fresh perspective to classic comfort food. From crafting unique sauces to sourcing locally grown ingredients, she’s all about elevating the humble burger into something extraordinary. Her energy and enthusiasm inspire her team, and her love for bold flavors keeps customers coming back for more.`
        }
    },
    {
        name: "Sushi",
        cost: BigInt(18000),
        baseCost: BigInt(18000),
        revenue: BigInt(1470),
        baseRevenue: BigInt(1470),
        quantity: 0,
        rate: 1.15,
        productionTime: 11000,
        baseProductionTime: 11000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Kaito Tanaka",
            cost: BigInt(600000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(125000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(25000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `As the manager of a bustling sushi restaurant, he brings precision and passion to every roll. With a keen eye for detail and a deep respect for tradition, he ensures that every piece of sushi is a work of art. His calm demeanor and leadership skills keep the kitchen running smoothly, while his innovative ideas help attract a new generation of sushi lovers.`
        }
    },
    {
        name: "Convenience",
        cost: BigInt(270000),
        baseCost: BigInt(270000),
        revenue: BigInt(11760),
        baseRevenue: BigInt(11760),
        quantity: 0,
        rate: 1.15,
        productionTime: 18000,
        baseProductionTime: 18000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Mei Fukuda",
            cost: BigInt(3500000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(500000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(900000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `Always on the move, she’s the heart and soul of her local convenience store. Whether she’s organizing shelves, helping customers, or brainstorming new ways to improve the shopping experience, her cheerful attitude and efficiency make her a standout. She takes pride in making the store a welcoming place for everyone who walks through the door.`
        }
    },
    {
        name: "Pachinko",
        cost: BigInt(4050000),
        baseCost: BigInt(4050000),
        revenue: BigInt(105840),
        baseRevenue: BigInt(105840),
        quantity: 0,
        rate: 1.15,
        productionTime: 30000,
        baseProductionTime: 30000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 10, effect: "Revenue ×2", applied: false },
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Nozomi Hoshino ",
            cost: BigInt(55000000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(1100000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(2300000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `In the vibrant world of pachinko, she’s a rising star. With a knack for understanding the games and a friendly demeanor, she ensures every customer has an exciting experience. Her ability to troubleshoot machines and keep the energy high makes her an invaluable part of the team, and she’s always looking for ways to make the parlor even more fun.`
        }
    },
    {
        name: "Video Games",
        cost: BigInt(81000000),
        baseCost: BigInt(81000000),
        revenue: BigInt(1058000),
        baseRevenue: BigInt(1058000),
        quantity: 0,
        rate: 1.15,
        productionTime: 60000,
        baseProductionTime: 60000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Nanami Ishikawa ",
            cost: BigInt(750000000),
            hired: false,
            upgrades: [
                { name: "Efficiency", cost: BigInt(7000000), effect: "Speed +50%", applied: false,},
                { name: "Revenue", cost: BigInt(15000000), effect: "Revenue ×2", applied: false,},
            ],
            bio: `A creative mind in the gaming industry, she’s passionate about bringing virtual worlds to life. Whether she’s coding, designing characters, or brainstorming storylines, her innovative ideas and teamwork skills shine. She’s driven by a love for gaming and a desire to create experiences that players will never forget.`
        }
    },
    {
        name: "TV",
        cost: BigInt(1620000000),
        baseCost: BigInt(1620000000),
        revenue: BigInt(15876000),
        baseRevenue: BigInt(15876000),
        quantity: 0,
        rate: 1.15,
        productionTime: 3600000,
        baseProductionTime: 3600000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Haruka Fujimoto",
            cost: BigInt(25000000000),
            hired: false,
            upgrades: [

            ],
            bio: `In the fast-paced world of television, she’s the glue that holds everything together. From coordinating schedules to assisting on set, her organizational skills and can-do attitude make her an essential part of the team. She’s always eager to learn and brings a fresh perspective to every project she works on.`
        }
    },
    {
        name: "Cars",
        cost: BigInt(48600000000),
        baseCost: BigInt(48600000000),
        revenue: BigInt(238140000),
        baseRevenue: BigInt(238140000),
        quantity: 0,
        rate: 1.15,
        productionTime: 86400000,
        baseProductionTime: 86400000,
        isProducing: false,
        startTime: 0,
        endTime: 0,
        unlocks: [
            { milestone: 25, effect: "Speed +50%", applied: false },
        ],
        manager: {
            name: "Miyu Nakagawa",
            cost: BigInt(1000000000000),
            hired: false,
            upgrades: [

            ],
            bio: `With a love for innovation and problem-solving, she’s making waves in the automotive industry. Whether she’s designing sleek new features or testing the latest technology, her passion for cars drives her to push boundaries. Her attention to detail and forward-thinking mindset make her a key player in shaping the future of transportation.`
        }
    },
];