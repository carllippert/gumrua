import Link from "next/link";
import { Button } from "../components/basic/button";
import { Tabs } from "../components/basic/tabs";
import Container from "../components/container";
import { CreatedProducts } from "../components/created-products";
import Layout from "../components/layout";
import { PurchasedProducts } from "../components/purchased-products";

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
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <Link href="/buy-crypto">
            <a>
              <Button>Buy crypto</Button>
            </a>
          </Link>
        </div>
        <Tabs items={items} className="mt-12 mb-8" />
      </Container>
    </Layout>
  );
};

export default DashboardPage;
