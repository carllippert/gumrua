import { Spinner } from "../components/basic/spinner";
import { ProductCard } from "../components/product-card";
import { useBoughtProducts } from "../hooks/use-bought-products";

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
      <div className="flex justify-center my-14">
        <p>No products purchased yet</p>
      </div>
    );

  return (
    <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
      {boughtProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
