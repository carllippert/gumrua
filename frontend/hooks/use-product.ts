import { useQuery } from "wagmi";
import { Product } from "../types/products";
import { useGumrua } from "./use-gumrua";

export const useProduct = (productId: number) => {
  const gumruaProduct = useGumrua();

  return useQuery<Product | undefined>(["product", productId], async () => {
    if (!gumruaProduct) return;

    const product = await gumruaProduct.products(productId);
    const { seller, name, price } = product;

    return {
      id: productId,
      seller: seller as `0x${string}`,
      name,
      price,
    };
  });
};
