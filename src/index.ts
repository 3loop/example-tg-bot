import { decoder } from "./decoder/decoder.js";
import TelegramBot from "node-telegram-bot-api";
import type { DecodedTx } from "@3loop/transaction-decoder";
import { interpretTx } from "./decoder/interpreter.js";
import { createPublicClient, webSocket, type Hex } from "viem";
import { CHAIN_ID, CHAT_ID, CONTRACT_ADDRESS, RPC } from "./constants.js";

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "");

const publicClient = createPublicClient({
  transport: webSocket(RPC[CHAIN_ID].url),
});

async function handleTransaction(txHash?: string) {
  try {
    console.log("Transaction mined!");
    if (!txHash) return;

    // Wait for the transaction to be confirmed, otherwise rpc can throw error
    await publicClient.waitForTransactionReceipt({ hash: txHash as Hex });

    const decoded = await decoder.decodeTransaction({
      chainID: CHAIN_ID,
      hash: txHash,
    });

    if (!decoded) return;

    const interpreted = interpretTx(decoded as DecodedTx);

    if (!interpreted.action) {
      console.log("No defined action for this transaction.", txHash);
      return;
    }

    const botMessage = `${interpreted.action} https://etherscan.io/tx/${txHash}`;

    console.log(botMessage);
    // bot.sendMessage(CHAT_ID, botMessage);
  } catch (e) {
    console.error(e);
  }
}

async function createSubscription(address: string) {
  await publicClient.transport.subscribe({
    method: "eth_subscribe",
    params: [
      //@ts-expect-error
      "alchemy_minedTransactions",
      {
        addresses: [{ to: address }],
        includeRemoved: false,
        hashesOnly: true,
      },
    ],
    onData: (data: any) => {
      const hash = data?.result?.transaction?.hash;
      if (hash) handleTransaction(hash);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

createSubscription(CONTRACT_ADDRESS);
