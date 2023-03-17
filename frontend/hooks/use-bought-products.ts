import { useAccount, useQuery } from "wagmi";
import { Product } from "../types/products";
import { useGumrua } from "./use-gumrua";

export const useBoughtProducts = () => {
  const { address } = useAccount();
  const gumrua = useGumrua();

  return useQuery<Product[]>(["bought-products", address], async () => {
    if (!gumrua || !address) return [];

    /* Get requests */
    const products: Product[] = [];
    const eventFilter = gumrua.filters.ProductBought(null, address);
    const events = await gumrua.queryFilter(eventFilter);

    for (const event of events) {
      if (!event.args) continue;

      const id = event.args._productId;
      const product = await gumrua.products(id);

      products.push({
        id: id.toNumber(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        priceEuro: product.priceEuro,
        seller: product.seller as `0x${string}`,
        image: product.image,
      });
    }

    return products;
  });
};
