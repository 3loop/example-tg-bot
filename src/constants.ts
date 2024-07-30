// Replace with your contract address and chain ID
export const CONTRACT_ADDRESS = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
export const CHAIN_ID = 1;
export const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export const RPC = {
  1: {
    url: `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  },
};
