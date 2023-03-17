import { ContractReceipt } from "ethers";
import { useMutation } from "wagmi";
import { useEureToken } from "./use-eure-token";

import { useGumrua } from "./use-gumrua";

export interface BuyProductData {
  id: number;
  withEuro?: boolean;
}

interface UseBuyProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useBuyProduct = (options?: UseBuyProductOptions) => {
  const gumrua = useGumrua(true);
  const eureToken = useEureToken(true);

  const mutation = useMutation(
    async ({ id, withEuro }: BuyProductData) => {
      if (!gumrua || !eureToken) return;

      if (withEuro) {
        const priceEuro = (await gumrua.products(id)).priceEuro;

        // approve usafe of euro token
        const approveTx = await eureToken.approve(gumrua.address, priceEuro);
        await approveTx.wait();
      }

      const price = (await gumrua.products(id)).price;
      const tx = await gumrua.buyProduct(id, {
        value: withEuro ? 0 : price,
      });

      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
