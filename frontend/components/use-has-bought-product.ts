import { useAccount, useQuery } from "wagmi";
import { useGumrua } from "../hooks/use-gumrua";

export const useHasBoughtProduct = (productId: number) => {
  const { address } = useAccount();
  const gumrua = useGumrua();

  return useQuery(["has-bought-product", productId, address], async () => {
    if (!gumrua || !address) return false;

    const eventFilter = gumrua.filters.ProductBought(productId, address);
    const events = await gumrua.queryFilter(eventFilter);

    if (events.length > 0) return true;
  });
};
