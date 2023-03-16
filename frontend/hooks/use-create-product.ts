import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "wagmi";

import { useGumrua } from "./use-gumrua";

export interface CreateProductData {
  name: string;
  price: BigNumber;
  image: string;
}

interface UseCreateProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const gumrua = useGumrua(true);
  const mutation = useMutation(
    async ({ name, price, image }: CreateProductData) => {
      if (!gumrua) return;
      const tx = await gumrua.createProduct(name, price, image);
      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
