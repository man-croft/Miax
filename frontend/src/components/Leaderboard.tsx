import { motion } from 'framer-motion';
import { TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * Leaderboard entry representing a player's ranking and score
 * @interface LeaderboardEntry
 */
type LeaderboardEntry = {
  /** Wallet address of the player */
  address: string;
  /** Display name or username */
  username: string;
  /** Total accumulated score */
  totalScore: number;
  /** Current ranking position (1-based) */
  rank: number;
};

/**
 * Props for the Leaderboard component
 * @interface LeaderboardProps
 */
type LeaderboardProps = {
  /** Array of leaderboard entries sorted by rank */
  data: LeaderboardEntry[];
  /** Current user's wallet address for highlighting */
  currentUserAddress?: string;
  /** Additional CSS classes to apply */
  className?: string;
};

/**
 * Leaderboard - Displays top players ranked by score with visual hierarchy
 * 
 * Features:
 * - Top 10 player rankings
 * - Medal-style rank indicators (gold, silver, bronze)
 * - Current user highlighting
 * - Truncated wallet addresses for privacy
 * - Smooth entry animations
 * - Current user position shown even if outside top 10
 * - Accessibility support with proper ARIA labels
 * 
 * @component
 * @example
 * ```tsx
 * <Leaderboard
 *   data={topPlayers}
 *   currentUserAddress="0x123..."
 *   className="mt-8"
 * />
 * ```
 * 
 * @param {LeaderboardProps} props - Component props
 * @returns {JSX.Element} Rendered leaderboard with rankings
 */
export function Leaderboard({ data, currentUserAddress, className = '' }: LeaderboardProps) {
  // Find current user's position if not in top 10
  const currentUserEntry = currentUserAddress 
    ? data.find(entry => entry.address.toLowerCase() === currentUserAddress.toLowerCase())
    : null;

  // Get top 10 entries
  const topEntries = data.slice(0, 10);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-600';
      case 2: return 'bg-gray-100 text-gray-600';
      case 3: return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <section className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`} aria-label="Game leaderboard">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" aria-hidden="true" />
          Leaderboard
        </h2>
      </div>
      
      <ol className="divide-y divide-gray-200" role="list" aria-label="Top 10 players ranking">
        {topEntries.map((entry, index) => (
          <motion.li 
            key={entry.address}
            className={`flex items-center px-6 py-4 ${
              entry.address.toLowerCase() === currentUserAddress?.toLowerCase() 
                ? 'bg-blue-50' 
                : ''
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div 
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm ${getMedalColor(entry.rank)}`}
              aria-label={`Rank ${entry.rank}`}
            >
              {entry.rank}
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {entry.username || `Player ${entry.rank}`}
              </p>
              <p className="text-xs text-gray-500 truncate" aria-label={`Wallet address: ${entry.address}`}>
                {`${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" aria-label={`Score: ${entry.totalScore} points`}>
                {entry.totalScore} pts
              </span>
            </div>
          </motion.li>
        ))}
        
        {currentUserEntry && !topEntries.some(e => e.address === currentUserAddress) && (
          <>
            <li className="h-px bg-gray-200 w-full my-2" aria-hidden="true"></li>
            <li className="px-6 py-3 bg-blue-50" role="listitem">
              <div className="flex items-center">
                <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">Your rank: {currentUserEntry.rank}</span>
                <span className="ml-auto text-sm font-medium text-gray-700" aria-label={`Your score: ${currentUserEntry.totalScore} points`}>
                  {currentUserEntry.totalScore} pts
                </span>
              </div>
            </li>
          </>
        )}
      </ol>
    </section>
  );
}
