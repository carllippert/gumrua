import { ethers } from "ethers";
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

const PurchaseInner = ({ slug }: { slug: string }) => {
  const { address } = useAccount();
  const router = useRouter();

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
            block
            label="Copy link"
          />
        ) : (
          <div>
            <Button
              className="mt-2 tracking-wider"
              block
              onClick={onBuyProduct}
            >
              Buy
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
