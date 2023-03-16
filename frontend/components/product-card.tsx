import Image from "next/image";
import { Product } from "../types/products";
import { Button } from "./basic/button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div key={product.id} className="flex flex-col justify-between">
      <div className="mb-4">
        <div className="relative h-40 rounded-box overflow-hidden">
          <Image
            src={product.image}
            layout="fill"
            objectFit="cover"
            alt="Product"
            priority
          />
        </div>
        <h4 className="font-semibold text-xl mt-3">{product.name}</h4>
        <p className="mt-2 text-base-content/80">{product.description}</p>
      </div>
      <Button>Download</Button>
    </div>
  );
};
