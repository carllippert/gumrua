import { useQuery } from "wagmi";
import { Product } from "../types/products";
import { useGumrua } from "./use-gumrua";

export const useProduct = (productId: number) => {
  const gumrua = useGumrua();

  return useQuery<Product | undefined>(["product", productId], async () => {
    if (!gumrua) return;

    const product = await gumrua.products(productId);
    const { seller, name, slug, description, price, priceEuro, image } =
      product;

    return {
      id: productId,
      seller: seller as `0x${string}`,
      name,
      slug,
      description,
      price,
      priceEuro,
      image,
    };
  });
};
