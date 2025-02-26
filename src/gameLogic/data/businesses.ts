import { Business } from '../types/business.types.ts';
import {
    burgerUnlocks,
    carsUnlocks,
    convenienceUnlocks, idolsUnlocks,
    pachinkoUnlocks,
    ramenUnlocks,
    sushiUnlocks,
    takoyakiUnlocks,
    tvUnlocks, videoGamesUnlocks,
} from "./unlocks.ts";

import {takoyakiManager} from "./managers/takoyakiManager.ts";
import {ramenManager} from "./managers/ramenManager.ts";
import {burgerManager} from "./managers/burgerManager.ts";
import {sushiManager} from "./managers/sushiManager.ts";
import {convenienceManager} from "./managers/convenienceManager.ts";
import {pachinkoManager} from "./managers/pachinkoManager.ts";
import {videoGamesManager} from "./managers/videoGamesManager.ts";
import {tvManager} from "./managers/tvManager.ts";
import {carsManager} from "./managers/carsManager.ts";
import {idolsManager} from "./managers/idolsManager.ts";

export const businesses: Business[] = [
    new Business("Takoyaki", BigInt(10), BigInt(5), 1.06, 3000, takoyakiUnlocks, 1, takoyakiManager),
    new Business("Ramen", BigInt(120), BigInt(30), 1.10, 4500, ramenUnlocks, 0, ramenManager),
    new Business("Burgers", BigInt(1200), BigInt(115), 1.10, 7000, burgerUnlocks, 0, burgerManager),
    new Business("Sushi", BigInt(42000), BigInt(970), 1.10, 11000, sushiUnlocks, 0, sushiManager),
    new Business("Convenience", BigInt(670000), BigInt(5600), 1.10, 18000, convenienceUnlocks, 0, convenienceManager),
    new Business("Pachinko", BigInt(45050000), BigInt(340840), 1.10, 30000, pachinkoUnlocks, 0, pachinkoManager),
    new Business("Video Games", BigInt(620000000), BigInt(4550800), 1.10, 60000, videoGamesUnlocks, 0, videoGamesManager),
    new Business("TV", BigInt(1620000000), BigInt(25876000), 1.10, 3600000, tvUnlocks, 0, tvManager),
    new Business("Cars", BigInt(24300000000), BigInt(268140000), 1.10, 43200000, carsUnlocks, 0, carsManager),
    new Business("Idols", BigInt(2750000000000), BigInt(34390000000), 1.2, 86400000, idolsUnlocks, 0, idolsManager),
];