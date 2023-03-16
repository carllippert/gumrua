import { ethers } from "ethers";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import { Spinner } from "../components/Spinner";
import { useBuyProduct } from "../hooks/use-buy-product";
import { useProduct } from "../hooks/use-product";

const PurchaseInner = ({ productId }: { productId: number }) => {
  const { data: product } = useProduct(productId);
  const { mutate: buyProduct } = useBuyProduct();

  if (!product) return <Spinner />;

  const onBuyProduct = async () => {
    buyProduct({
      id: productId,
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
  const productId = Number(router.query.product_id?.toString());

  console.log("Product ID: ", productId);

  if (productId === undefined || Number.isNaN(productId)) return null;

  return <PurchaseInner productId={productId} />;
};

export default Purchase;
