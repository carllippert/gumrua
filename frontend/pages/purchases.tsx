import Layout from "../components/Layout";
import { useBoughtProducts } from "../hooks/use-bought-products";

const PurchasesPage = () => {
  const { data: boughtProducts } = useBoughtProducts();

  return (
    <Layout>
      <div>
        {boughtProducts?.map((product) => (
          <div key={product.id}>
            <h4>{product.name}</h4>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default PurchasesPage;
