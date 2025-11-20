import { useContractRead, useContractWrite, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { parseEther } from 'viem';

export function useFaucet() {
  const { address } = useAccount();
  
  // Read contract balance
  const { data: contractBalance } = useContractRead({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
    watch: true,
  });

  // Claim function
  const { 
    write: claim, 
    data: claimData, 
    isLoading: claimIsLoading 
  } = useContractWrite({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'claim',
  });

  // Wait for transaction to complete
  const { isLoading: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  // Claim amount (0.1 cUSD)
  const claimAmount = parseEther('0.1');

  return {
    claim,
    claimIsLoading,
    claimIsSuccess,
    claimAmount,
    contractBalance,
  };
}
