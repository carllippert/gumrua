import Link from "next/link";
import { Button } from "../components/basic/button";
import { Spinner } from "../components/basic/spinner";
import { ProductCard } from "../components/product-card";
import { useCreatedProducts } from "../hooks/use-created-products";

export const CreatedProducts = () => {
  const { data: createdProducts, isLoading } = useCreatedProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center my-14">
        <Spinner />
      </div>
    );
  }

  if (createdProducts?.length === 0)
    return (
      <div className="flex my-14 flex-col gap-3 items-center">
        <p>No products created yet</p>
        <Link href="/create">
          <a>
            <Button>Create product</Button>
          </a>
        </Link>
      </div>
    );

  return (
    <div className="grid-cols-1 grid gap-x-6 gap-y-10 md:grid-cols-2">
      {createdProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
