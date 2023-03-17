import Container from "../components/container";
import Layout from "../components/layout";
import { ProductCard } from "../components/product-card";
import { useCreatedProducts } from "../hooks/use-created-products";

const DashboardPage = () => {
  const { data: createdProducts } = useCreatedProducts();

  return (
    <Layout>
      <Container className="mt-10 max-w-[50rem]">
        <h1 className="text-4xl font-bold mt-4 mb-8">Your created products</h1>
        <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
          {createdProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default DashboardPage;
