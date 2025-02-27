import { Business } from '../types/business.types.ts';
import {
    burgerUnlocks, carsUnlocks,
    convenienceUnlocks, idolsUnlocks,
    pachinkoUnlocks, ramenUnlocks,
    sushiUnlocks, takoyakiUnlocks,
    tvUnlocks, videoGamesUnlocks,
} from "./unlocks.ts";
import Decimal from "break_infinity.js";
import {
    burgerManager, carsManager,
    convenienceManager, idolsManager,
    pachinkoManager, sushiManager,
    ramenManager, videoGamesManager,
    takoyakiManager, tvManager
} from "./managers.ts";

export const businesses: Business[] = [
    new Business("Takoyaki", new Decimal(10), new Decimal(5), 1.07, 3000, takoyakiUnlocks, 1, takoyakiManager),
    new Business("Ramen", new Decimal(180), new Decimal(30), 1.10, 4500, ramenUnlocks, 0, ramenManager),
    new Business("Burgers", new Decimal(1600), new Decimal(115), 1.10, 7000, burgerUnlocks, 0, burgerManager),
    new Business("Sushi", new Decimal(62000), new Decimal(970), 1.10, 11000, sushiUnlocks, 0, sushiManager),
    new Business("Convenience", new Decimal(980000), new Decimal(5600), 1.10, 18000, convenienceUnlocks, 0, convenienceManager),
    new Business("Pachinko", new Decimal(45050000), new Decimal(340840), 1.10, 90000, pachinkoUnlocks, 0, pachinkoManager),
    new Business("Video Games", new Decimal(620000000), new Decimal(4550800), 1.10, 300000, videoGamesUnlocks, 0, videoGamesManager),
    new Business("TV", new Decimal(1620000000), new Decimal(25876000), 1.10, 3600000, tvUnlocks, 0, tvManager),
    new Business("Cars", new Decimal(24300000000), new Decimal(268140000), 1.10, 43200000, carsUnlocks, 0, carsManager),
    new Business("Idols", new Decimal(2750000000000), new Decimal(34390000000), 1.2, 86400000, idolsUnlocks, 0, idolsManager),
];