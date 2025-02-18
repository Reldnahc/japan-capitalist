import { Manager } from "../../types/manager.types.ts";
import { ramenUpgrades } from "../upgrades";

export const ramenManager = new Manager(
    "Yui Sasaki",
    "佐々木結衣",
    BigInt(15000), // Cost to hire
    ramenUpgrades, // Associated upgrades
    `With a fiery passion for noodles and broth, this young professional has quickly made a name for herself in the ramen scene. Whether she’s experimenting with new flavor combinations or perfecting the texture of handmade noodles, her dedication to the craft is unmatched. She thrives in the fast-paced kitchen environment, always striving to create bowls that warm the soul and leave customers craving more.` // Bio
);