# Build a Telegram Bot for human-readable alerts

> [!NOTE]  
> You can jump to the [Loop Decoder Documentation](https://loop-decoder.3loop.io/recipes/tg-bot/) to read the entire tutorial in one place.

Learn how to create a Telegram bot that sends human-readable alerts about transactions happening on-chain. You can customize this bot for any EVM-compatible blockchain, and you don't need any specific knowledge about EVM transaction decoding and interpretation.

### Step 0: Prerequisites

- An installed Bun (see installation guide [here](https://bun.sh/docs/installation))
- An Alchemy account (sign up [here](https://www.alchemy.com/))
- An Etherscan account (sign up [here](https://etherscan.io/register))
- A Telegram account

### Step 1: Clone the Repository

Clone the Bot [repository](https://github.com/3loop/example-tg-bot) from GitHub and install project dependecies:

```bash
git clone https://github.com/3loop/example-tg-bot
cd example-tg-bot
bun i
```

### Step 2: Add Etherescan and Alchemy API Keys

Copy and rename the `.env.example` file to `.env`, then paste the Alchemy and Etherescan API keys into the `ALCHEMY_API_KEY` and `ETHERSCAN_API_KEY` variables.

```bash
cp .env.example .env
vim .env
```

We use the Alchemy API key to monitor new transactions happening on the blockchain, and the Etherscan API key (from the free plan) to fetch contract ABIs and avoid hitting rate limits. The Etherscan API could be optional if the transactions you are interested in do not interact with many contracts, but since we are testing AAVE V3 it will have many interactions.

### Step 3: Create a New Bot on Telegram

1. **Obtain a bot token**: Start a chat with the [BotFather](https://t.me/BotFather) bot in Telegram, write `/newbot` into the chat, follow the instructions, and copy the bot token. Paste its value into the `TELEGRAM_BOT_TOKEN` variable in the `.env` file.
2. **Obtain a chat ID**: Get the chat ID of the chat where the bot should send notifications. Start a chat with your bot by pressing the `/start` command. Then open to the link `https://api.telegram.org/bot<YourBOTToken>/getUpdates`, where `YourBotToken` is the token you copied from the BotFather. From the `chat` object, copy the `id` and put it into the `TELEGRAM_CHAT_ID` variable in the `.env` file. Check this [StackOverflow answer](https://stackoverflow.com/a/32572159) for more details.

### Step 4: Start the Bot

Use the following command to start the server locally:

```bash
bun run src/index.ts
```

Your Telegram bot is now set up and will monitor blockchain transactions and send alerts to the specified chat or channel.

### Step 5: Check the guide to learn how it works and modify it

The [guide](https://loop-decoder.3loop.io/recipes/tg-bot/) describes all components of the bot and how to modify it to monitor the different EVM contacts.


## Feedback

Let us know on X/Twitter ([@3loop_io](https://x.com/3loop_io)) if you encounter any problems or have any questions, we'd love to help you!

Happy coding!
