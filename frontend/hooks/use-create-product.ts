import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "wagmi";

import { useGumrua } from "./use-gumrua";

export interface CreateProductData {
  name: string;
  price: BigNumber;
  image: string;
  slug: string;
  description: string;
}

interface UseCreateProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const gumrua = useGumrua(true);
  const mutation = useMutation(
    async ({ name, slug, description, price, image }: CreateProductData) => {
      if (!gumrua) return;
      const tx = await gumrua.createProduct(
        name,
        slug,
        description,
        price,
        image
      );
      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
