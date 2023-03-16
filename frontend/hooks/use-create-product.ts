import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "wagmi";
import { uploadImage, uploadPdf } from "../utils/upload-file";

import { useGumrua } from "./use-gumrua";

export interface CreateProductData {
  name: string;
  price: BigNumber;
  image: File;
  pdf: File;
  slug: string;
  description: string;
}

interface UseCreateProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const gumrua = useGumrua(true);
  const mutation = useMutation(
    async ({
      name,
      slug,
      description,
      price,
      image,
      pdf,
    }: CreateProductData) => {
      if (!gumrua) return;

      const imageUrl = await uploadImage(image);
      if (!imageUrl) return;

      await uploadPdf(pdf);

      const tx = await gumrua.createProduct(
        name,
        slug,
        description,
        price,
        imageUrl
      );
      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
