import { Tabs } from "../components/basic/tabs";
import Container from "../components/container";
import Layout from "../components/layout";
import { ProductCard } from "../components/product-card";
import { useBoughtProducts } from "../hooks/use-bought-products";
import { useCreatedProducts } from "../hooks/use-created-products";

const CreatedProducts = () => {
  const { data: createdProducts } = useCreatedProducts();

  return (
    <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
      {createdProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const PurchasedProducts = () => {
  const { data: boughtProducts } = useBoughtProducts();

  return (
    <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
      {boughtProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const items = [
    {
      label: "Created Products",
      content: <CreatedProducts />,
    },
    {
      label: "Purchased Products",
      content: <PurchasedProducts />,
    },
  ];

  return (
    <Layout>
      <Container className="mt-10 max-w-[50rem]">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <Tabs items={items} className="mt-6 mb-8" />
      </Container>
    </Layout>
  );
};

export default DashboardPage;
