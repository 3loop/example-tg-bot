//@ts-nocheck

export const interpretTx = function transformEvent(event) {
  const methodName = event.methodCall.name
  let action = ''

  const newEvent = {
    action: action,
    txHash: event.txHash,
    user: event.fromAddress,
    method: methodName,
    assetsSent: event.assetsSent,
    assetsReceived: event?.assetsReceived,
  }

  switch (methodName) {
    case 'repay':
      action = 'User repaid ' + event.assetsSent[1]?.amount + ' ' + event.assetsSent[1]?.symbol
      break
    
    case 'repayWithPermit':
      action = 'User repaid ' + event.assetsSent[1]?.amount + ' ' + event.assetsSent[1]?.symbol
      break

    case 'deposit':
      action = 'User deposited ' + event.assetsSent[0]?.amount + ' ' + event.assetsSent[0]?.symbol
      break

    case 'borrow':
      action = 'User borrowed ' + event.assetsReceived[1]?.amount + ' ' + event.assetsReceived[1]?.symbol
      break

    case 'withdraw':
      action = 'User withdrew ' + event.assetsReceived[0]?.amount + ' ' + event.assetsReceived[0]?.symbol
      break
    
    case 'supply':
      action = 'User supplied ' + event.assetsSent[0]?.amount + ' ' + event.assetsSent[0]?.symbol
      break
    
    case 'supplyWithPermit':
      action = 'User supplied ' + event.assetsSent[0]?.amount + ' ' + event.assetsSent[0]?.symbol
      break
  }

  newEvent.action = action

  return newEvent
}
