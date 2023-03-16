import { ethers } from "ethers";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import { Spinner } from "../components/Spinner";
import { useBuyProduct } from "../hooks/use-buy-product";
import { useProductBySlug } from "../hooks/use-product-by-slug";

const PurchaseInner = ({ slug }: { slug: string }) => {
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
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="mt-4 text-lg">
        Price: {ethers.utils.formatEther(product.price)}
      </p>
      <button
        className="bg-blue-500 text-lg py-1 px-4 rounded-md mt-4"
        onClick={onBuyProduct}
      >
        Buy
      </button>
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
