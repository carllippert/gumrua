import { ContractReceipt } from "ethers";
import { useMutation } from "wagmi";

import { useGumrua } from "./use-gumrua";

export interface BuyProductData {
  id: number;
}

interface UseBuyProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useBuyProduct = (options?: UseBuyProductOptions) => {
  const gumrua = useGumrua(true);
  const mutation = useMutation(
    async ({ id }: BuyProductData) => {
      if (!gumrua) return;

      const price = (await gumrua.products(id)).price;
      const tx = await gumrua.buyProduct(id, {
        value: price,
      });

      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
