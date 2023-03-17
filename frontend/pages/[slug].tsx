import { ethers } from "ethers";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Button } from "../components/basic/button";
import Layout from "../components/layout";
import { Spinner } from "../components/basic/spinner";
import { useBuyProduct } from "../hooks/use-buy-product";
import { useProductBySlug } from "../hooks/use-product-by-slug";
import Container from "../components/container";
import { CopyButton } from "../components/copy-button";
import Link from "next/link";
import { Product } from "../types/products";
import { useHasBoughtProduct } from "../components/use-has-bought-product";
import { DownloadButton } from "../components/download-button";
import QRCode from "react-qr-code";
import Navbar from "../components/navbar";
import { EyeIcon } from "@heroicons/react/24/outline";

const QR = () => {
  const [hide, setHide] = useState(true);

  return (
    <div className="w-full mt-2">
      {hide ? (
        <Button
          onClick={() => setHide(false)}
          rightIcon={<EyeIcon className="h-5 w-5" />}
          className="mt-2 tracking-wider"
          block
        >
          QR Code
        </Button>
      ) : (
        <div className="mx-auto mt-12 h-52 w-52 bg-pink-200">
          <QRCode
            onClick={() => setHide(true)}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={window.location.href}
            viewBox={`0 0 256 256`}
            className="bg-blue-200"
          />
        </div>
      )}
    </div>
  );
};
const ProductInfo = ({ product }: { product: Product }) => {
  const { address } = useAccount();
  const router = useRouter();
  const { mutate: buyProduct, isLoading } = useBuyProduct({
    onSuccess() {
      router.push(`/dashboard`);
    },
  });

  const { data: hasBoughtProduct } = useHasBoughtProduct(product.id);

  const onBuyProduct = async () => {
    buyProduct({
      id: product.id,
    });
  };

  const onBuyProductWithEuro = async () => {
    buyProduct({
      id: product.id,
      withEuro: true,
    });
  };

  return (
    <>
      <div className="relative h-40 rounded-box overflow-hidden lg:mt-20">
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
      <div className="bg-base-200 rounded-box mt-6 mb-4 flex justify-between items-center px-4 py-3">
        <b>Price: </b>
        <span>{ethers.utils.formatEther(product.priceEuro)} EURe</span>
      </div>
      {address === product.seller ? (
        <>
          <CopyButton
            text={window.location.href}
            className="mt-2 tracking-wider"
            block
            label="Copy link"
          />
          <QR />
        </>
      ) : (
        <>
          {hasBoughtProduct ? (
            <DownloadButton slug={product.slug} block />
          ) : (
            <div>
              <Button
                className="mt-2 tracking-wider"
                block
                onClick={onBuyProduct}
                disabled={isLoading}
                loading={isLoading}
              >
                Buy
              </Button>
              <Button
                className="mt-2 tracking-wider"
                block
                onClick={onBuyProductWithEuro}
                disabled={isLoading}
                loading={isLoading}
              >
                Buy with EURe
              </Button>
              <div className="divider"></div>
              <div className="mt-4 flex-col flex w-full">
                <p className="mb-2 text-center">Running low on crypto?</p>
                <Link href="/buy-crypto">
                  <a>
                    <Button color="secondary" block>
                      Buy crypto
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const PurchaseInner = ({ slug }: { slug: string }) => {
  const { data: product } = useProductBySlug(slug);
  if (!product) return <Spinner />;

  return <ProductInfo product={product} />;
};

const Purchase = () => {
  const router = useRouter();
  const slug = router.query.slug?.toString();

  if (!slug) return null;

  return (
    <Layout>
      <Navbar currentPage="item" />
      <Container className="mt-10">
        <PurchaseInner slug={slug} />
      </Container>
    </Layout>
  );
};

export default Purchase;
