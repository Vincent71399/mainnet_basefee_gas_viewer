import { Network } from "alchemy-sdk";

export const ALCHEMY_CONFIG = {
    apiKey: "Your Alchemy key",
    network: Network.ETH_MAINNET,
};

//10 blocks look back should be 9
export const BLOCK_LOOK_BACK = 9