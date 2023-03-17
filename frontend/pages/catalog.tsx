import { Spinner } from "../components/basic/spinner";
import Container from "../components/container";
import Layout from "../components/layout";
import Navbar from "../components/navbar";
import { ProductCard } from "../components/product-card";
import { useProducts } from "../hooks/use-products";

const Catalog = () => {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center my-14">
        <Spinner />
      </div>
    );
  }

  if (products?.length === 0)
    return (
      <div className="flex justify-center my-14">
        <p>No products purchased yet</p>
      </div>
    );

  return (
    <div className="grid-cols-1 grid gap-6 md:grid-cols-2">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const CatalogPage = () => {
  return (
    <Layout>
      <Navbar currentPage="dashboard" />
      <Container className="mt-10 max-w-[50rem]">
        <h1 className="text-4xl font-bold mb-6">Catalog</h1>
        <Catalog />
      </Container>
    </Layout>
  );
};

export default CatalogPage;
