import { useQuery } from "wagmi";
import { Product } from "../types/products";
import { useGumrua } from "./use-gumrua";

export const useProductBySlug = (productSlug: string) => {
  const gumrua = useGumrua();

  return useQuery<Product | undefined>(
    ["product-by-slug", productSlug],
    async () => {
      if (!gumrua) return;

      const productId = await gumrua.slugToId(productSlug);
      if (productId.eq(0)) return;

      const product = await gumrua.products(productId);
      const { seller, name, slug, price, image } = product;

      return {
        id: productId.toNumber(),
        seller: seller as `0x${string}`,
        name,
        slug,
        price,
        image,
      };
    }
  );
};
