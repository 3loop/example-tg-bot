import { Alchemy, AlchemySubscription, Network } from "alchemy-sdk";
import Fastify from "fastify";
import { decoder } from "./decoder.js";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { DecodedTx } from "@3loop/transaction-decoder";
import { interpretTx } from "./interpreter.js";
import { setTimeout } from "timers/promises";

dotenv.config();

const chatId = process.env.TELEGRAM_CHAT_ID || "";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "");

// Replace with your contract address and chain ID
const contractAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
const chainID = 1;

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

async function decodeTx(txHash: string) {
  try {
    const decoded = await decoder.decodeTransaction({
      chainID: chainID,
      hash: txHash,
    });

    return decoded;
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    return null;
  }
}

async function handleTransaction(txHash?: string) {
  try {
    console.log("Transaction mined!");
    if (!txHash) return;

    // Wait for the transaction to be confirmed, otherwise rpc can throw error
    await setTimeout(10000);

    const decoded = await decodeTx(txHash);
    if (!decoded) return;

    const interpreted = interpretTx(decoded as DecodedTx);

    if (!interpreted.action) {
      console.log("No defined action for this transaction.", txHash);
      return;
    }

    const botMessage = `${interpreted.action} https://etherscan.io/tx/${txHash}`;

    bot.sendMessage(chatId, botMessage);
  } catch (e) {
    console.error(e);
  }
}

function createSubscription(address: string) {
  // Subscription for Alchemy's pendingTransactions Enhanced API
  console.log("Creating subscription for", address);
  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [
        {
          to: address,
        },
      ],
      includeRemoved: false,
      hashesOnly: true,
    },
    (tx) => handleTransaction(tx?.transaction?.hash)
  );
}

const fastify = Fastify({ logger: true });

fastify.listen({ port: 3000 }, async (err, address) => {
  if (err) throw err;
  console.log(`Server listening on ${address}`);
  createSubscription(contractAddress);
});
