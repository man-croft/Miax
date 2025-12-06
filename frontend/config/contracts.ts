// Contract addresses
// Contract ABIs
export const FAUCET_ABI = [
  'function claim() external',
  'function claimAmount() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function withdraw() external',
] as const;

export const TRIVIA_GAME_ABI = [
  'function createGame(string memory _title, uint256 _entryFee, uint256 _maxPlayers, uint256 _startTime, uint256 _endTime) external',
  'function joinGame(uint256 _gameId) external',
  'function submitAnswers(uint256 _gameId, uint8[] calldata _answers) external',
  'function claimPrize(uint256 _gameId) external',
  'function cancelGame(uint256 _gameId) external',
  'function getGame(uint256 _gameId) external view returns (Game memory)',
  'function getPlayerGames(address _player) external view returns (uint256[] memory)',
  'function getActiveGames() external view returns (uint256[])',
  'function getGamePlayers(uint256 _gameId) external view returns (address[] memory)',
  'function getGameWinners(uint256 _gameId) external view returns (address[] memory)',
  'function getGameState(uint256 _gameId) external view returns (uint8)',
  'function getGamePrizePool(uint256 _gameId) external view returns (uint256)',
  'function hasPlayerPlayed(uint256 _gameId, address _player) external view returns (bool)',
] as const;

export const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
] as const;

// Contract addresses - To be deployed on Base
export const CONTRACTS = {
  faucet: {
    address: '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d' as `0x${string}`, // Update after Base deployment
    abi: FAUCET_ABI,
  },
  triviaGame: {
    address: '0xc4AE01295cfAE3DA96b044F1a4284A93837a644C' as `0x${string}`, // Update after Base deployment
    abi: TRIVIA_GAME_ABI,
  },
  triviaGameV2: {
    address: '0xc4AE01295cfAE3DA96b044F1a4284A93837a644C' as `0x${string}`, // Update after Base deployment
    abi: TRIVIA_GAME_ABI,
  },
  USDC: {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`, // Base Sepolia USDC
    abi: USDC_ABI,
  },
} as const;

// Game state enum to match the smart contract
export enum GameState {
  Active,
  InProgress,
  Completed,
  Cancelled
}

// Game type to match the smart contract
export interface Game {
  id: bigint;
  title: string;
  entryFee: bigint;
  prizePool: bigint;
  maxPlayers: number;
  startTime: bigint;
  endTime: bigint;
  state: GameState;
  // These arrays are handled separately in the contract
  // and should be fetched using their respective getter functions
}

// Base Sepolia network configuration
export const BASE_NETWORK = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 1059647,
    },
  },
} as const;
