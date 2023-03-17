import Container from "../components/container";
import Layout from "../components/layout";
import { ProductCard } from "../components/product-card";
import { useBoughtProducts } from "../hooks/use-bought-products";

const PurchasesPage = () => {
  const { data: boughtProducts } = useBoughtProducts();

  return (
    <Layout>
      <Container className="mt-10 max-w-[50rem]">
        <h1 className="text-4xl font-bold mt-4 mb-8">
          Your purchased products
        </h1>
        <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
          {boughtProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Layout>
  );
};

export default PurchasesPage;
