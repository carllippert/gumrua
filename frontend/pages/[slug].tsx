import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { useToken } from "wagmi";
import { Button } from "../components/basic/button";
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
      <div className="max-w-[30rem] mx-auto mt-10">
        <div className="relative h-40 rounded-box overflow-hidden">
          <Image
            src={product.image}
            layout="fill"
            objectFit="cover"
            alt="Product"
          />
        </div>
        <h1 className="text-5xl font-medium mt-4">{product.name}</h1>
        <p className="mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
          velit rerum reprehenderit natus omnis eligendi iure amet fugit
          assumenda cumque id ad qui quos alias odit iusto provident. Nostrum
          accusamus quae iure quod maiores!
        </p>
        <div className="bg-base-200 rounded-box mt-5 mb-2 flex justify-between items-center px-4 py-3">
          <b>Price: </b>
          <span>{ethers.utils.formatEther(product.price)} xDAI</span>
        </div>
        <Button className="mt-2" block onClick={onBuyProduct}>
          Buy
        </Button>
      </div>
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
