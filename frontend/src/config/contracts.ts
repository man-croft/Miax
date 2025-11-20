// Contract ABIs
const FAUCET_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract addresses
export const CONTRACTS = {
  faucet: {
    address: '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d' as `0x${string}`,
    abi: FAUCET_ABI,
  },
  cUSD: {
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    abi: [], // Add cUSD ABI if needed
  },
} as const;
