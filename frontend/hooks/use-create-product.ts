import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "wagmi";

import { useGumrua } from "./use-gumrua";

export interface CreateProductData {
  name: string;
  price: BigNumber;
}

interface UseCreateProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const gumrua = useGumrua(true);
  const mutation = useMutation(
    async ({ name, price }: CreateProductData) => {
      if (!gumrua) return;
      const tx = await gumrua.createProduct(name, price);
      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
