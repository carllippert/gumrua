import { useContract, useNetwork, useProvider, useSigner } from "wagmi";
import { GumruaAbi } from "../abis/gumrua";

import { Gumrua } from "../abis/types/gumrua";
import { GUMRUA_PRODUCT_ADDRESS } from "../constants/addresses";

export const useGumrua = (withSigner: boolean = false) => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  return useContract({
    address: GUMRUA_PRODUCT_ADDRESS[chain?.id ?? 31337],
    abi: GumruaAbi,
    signerOrProvider: withSigner ? signer : provider,
  }) as Gumrua | null;
};
