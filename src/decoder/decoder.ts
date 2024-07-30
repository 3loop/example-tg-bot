import {
  EtherscanStrategyResolver,
  FourByteStrategyResolver,
  type VanillaAbiStore,
  type ContractABI,
  TransactionDecoder,
} from '@3loop/transaction-decoder'
import type { ContractData, VanillaContractMetaStore } from '@3loop/transaction-decoder'
import { ERC20RPCStrategyResolver } from '@3loop/transaction-decoder'
import { createPublicClient, http } from 'viem'

const contractMetaCache = new Map<string, ContractData>()
const abiCache = new Map<string, ContractABI>()

const abiStore: VanillaAbiStore = {
  strategies: [
    EtherscanStrategyResolver({
      apikey: process.env.ETHERSCAN_API_KEY,
    }),
    FourByteStrategyResolver(),
  ],
  get: async ({ address, event, signature }) => {
    const value = abiCache.get(address)
    if (value) {
      return {
        status: 'success',
        result: value,
      }
    } else if (event != null && value) {
      return {
        status: 'success',
        result: value,
      }
    } else if (signature != null && value) {
      return {
        status: 'success',
        result: value,
      }
    }

    return {
      status: 'empty',
      result: null,
    }
  },
  set: async (_key, value) => {
    if (value.status === 'success') {
      if (value.result.type === 'address') {
        abiCache.set(value.result.address, value.result)
      } else if (value.result.type === 'event') {
        abiCache.set(value.result.event, value.result)
      } else if (value.result.type === 'func') {
        abiCache.set(value.result.signature, value.result)
      }
    }
  },
}


const contractMetaStore: VanillaContractMetaStore = {
  strategies: [ERC20RPCStrategyResolver],
  get: async ({ address, chainID }) => {
    const key = `${address}-${chainID}`.toLowerCase()
    const value = contractMetaCache.get(key)

    if (value) {
      return {
        status: 'success',
        result: value,
      }
    }

    return {
      status: 'empty',
      result: null,
    }
  },
  set: async ({ address, chainID }, result) => {
    const key = `${address}-${chainID}`.toLowerCase()

    if (result.status === 'success') {
      contractMetaCache.set(key, result.result)
    }
  },
}

const getPublicClient = (chainId: number) => {
  return {
    client: createPublicClient({
      transport: http('https://rpc.ankr.com/eth'),
    }),
  }
}

export const decoder = new TransactionDecoder({
  getPublicClient: getPublicClient,
  abiStore: abiStore,
  contractMetaStore: contractMetaStore,
});
