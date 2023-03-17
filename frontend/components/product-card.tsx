import Image from "next/image";
import { useAccount } from "wagmi";
import { Product } from "../types/products";
import { Button } from "./basic/button";
import { CopyButton } from "./copy-button";
import Link from "next/link";
import { DownloadButton } from "./download-button";

interface ProductCardProps {
  product: Product;
  linkToPage?: boolean;
}

export const ProductCard = ({ product, linkToPage }: ProductCardProps) => {
  const { address } = useAccount();

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
      {linkToPage ? (
        <Link href={`/${product.slug}`}>
          <a>
            <Button block>View</Button>
          </a>
        </Link>
      ) : (
        <>
          {address === product.seller ? (
            <CopyButton
              text={`${window.location.origin}/${product.slug}`}
              className="mt-2"
              block
              label="Copy link"
            />
          ) : (
            <DownloadButton slug={product.slug} />
          )}
        </>
      )}
    </div>
  );
};
