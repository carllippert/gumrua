import { useContract, useNetwork, useProvider, useSigner } from "wagmi";
import { ERC20Abi } from "../abis/erc20";
import { ERC20 } from "../abis/types/erc20";

import { EURE_TOKEN_ADDRESS } from "../constants/addresses";

export const useEureToken = (withSigner: boolean = false) => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  return useContract({
    address: EURE_TOKEN_ADDRESS[chain?.id ?? 31337],
    abi: ERC20Abi,
    signerOrProvider: withSigner ? signer : provider,
  }) as ERC20 | null;
};
