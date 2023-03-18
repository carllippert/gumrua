import Link from "next/link";
import { Spinner } from "../components/basic/spinner";
import { ProductCard } from "../components/product-card";
import { useBoughtProducts } from "../hooks/use-bought-products";
import { Button } from "./basic/button";

export const PurchasedProducts = () => {
  const { data: boughtProducts, isLoading } = useBoughtProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center my-14">
        <Spinner />
      </div>
    );
  }

  if (boughtProducts?.length === 0)
    return (
      <div className="flex my-14 flex-col gap-3 items-center">
        <p>No products purchased yet</p>
        <Link href="/catalog">
          <a>
            <Button>Explore products</Button>
          </a>
        </Link>
      </div>
    );

  return (
    <div className="grid-cols-1 grid gap-x-6 gap-y-10 md:grid-cols-2">
      {boughtProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
