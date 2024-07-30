//@ts-nocheck

import type { DecodedTx } from "@3loop/transaction-decoder";

function assetsSent(s, r) {
  return s.filter((e) => e.from.toLowerCase() === r.toLowerCase());
}
function assetsReceived(s, r) {
  return s.filter((e) => e.to.toLowerCase() === r.toLowerCase());
}

function getAction(event): string {
  const methodName = event.method;
  switch (methodName) {
    case "repay":
    case "repayWithPermit":
      return `User repaid ${event.assetsSent[1]?.amount} ${event.assetsSent[1]?.symbol}`;
    case "deposit":
      return `User deposited ${event.assetsSent[0]?.amount} ${event.assetsSent[0]?.symbol}`;
    case "borrow":
      return `User borrowed ${event.assetsReceived[1]?.amount} ${event.assetsReceived[1]?.symbol}`;
    case "withdraw":
      return `User withdrew ${event.assetsReceived[0]?.amount} ${event.assetsReceived[0]?.symbol}`;
    case "supply":
    case "supplyWithPermit":
      return `User supplied ${event.assetsSent[0]?.amount} ${event.assetsSent[0]?.symbol}`;
    default:
      return "";
  }
}

export const interpretTx = function transformEvent(event: DecodedTx) {
  const newEvent = {
    txHash: event.txHash,
    user: event.fromAddress,
    method: event.methodCall.name,
    assetsSent: assetsSent(event.transfers, event.fromAddress),
    assetsReceived: assetsReceived(event.transfers, event.fromAddress),
    action: null,
  };

  const action = getAction(newEvent);
  newEvent.action = action;

  return newEvent;
};
