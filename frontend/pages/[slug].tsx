import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount, useToken } from "wagmi";
import { Button } from "../components/basic/button";
import Layout from "../components/layout";
import { Spinner } from "../components/basic/spinner";
import { useBuyProduct } from "../hooks/use-buy-product";
import { useProductBySlug } from "../hooks/use-product-by-slug";
import { copyToClipboard } from "../utils/copy-to-clipboard";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import Container from "../components/container";
import { CopyButton } from "../components/copy-button";

const PurchaseInner = ({ slug }: { slug: string }) => {
  const { address } = useAccount();
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const { data: product } = useProductBySlug(slug);
  const { mutate: buyProduct } = useBuyProduct({
    onSuccess() {
      router.push(`/purchases`);
    },
  });

  if (!product) return <Spinner />;

  const onBuyProduct = async () => {
    buyProduct({
      id: product.id,
    });
  };

  const onCopyLink = () => {
    copyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Layout>
      <Container className="mt-10">
        <div className="relative h-40 rounded-box overflow-hidden">
          <Image
            src={product.image}
            layout="fill"
            objectFit="cover"
            alt="Product"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">{product.name}</h1>
        <p className="mt-5">{product.description}</p>
        <div className="bg-base-200 rounded-box mt-6 mb-2 flex justify-between items-center px-4 py-3">
          <b>Price: </b>
          <span>{ethers.utils.formatEther(product.price)} xDAI</span>
        </div>
        {address === product.seller ? (
          <CopyButton
            text={window.location.href}
            className="mt-2 tracking-wider"
            size="lg"
            block
            label="Copy link"
          />
        ) : (
          <Button
            className="mt-2 tracking-wider"
            size="lg"
            block
            onClick={onBuyProduct}
          >
            Buy
          </Button>
        )}
      </Container>
    </Layout>
  );
};

const Purchase = () => {
  const router = useRouter();
  const slug = router.query.slug?.toString();

  if (!slug) return null;

  return <PurchaseInner slug={slug} />;
};

export default Purchase;