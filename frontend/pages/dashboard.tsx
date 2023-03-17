import Link from "next/link";
import { Button } from "../components/basic/button";
import { Tabs } from "../components/basic/tabs";
import Container from "../components/container";
import { CreatedProducts } from "../components/created-products";
import Layout from "../components/layout";
import Navbar from "../components/navbar";
import { PurchasedProducts } from "../components/purchased-products";

const DashboardPage = () => {
  const items = [
    {
      label: "Purchased Products",
      content: <PurchasedProducts />,
    },
    {
      label: "Created Products",
      content: <CreatedProducts />,
    },
  ];

  return (
    <Layout>
      <Navbar currentPage="dashboard" />
      <Container className="mt-10 max-w-[50rem]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/account">
              <a>
                <Button variant="outline">Account</Button>
              </a>
            </Link>
            <Link href="/create">
              <a>
                <Button>Sell</Button>
              </a>
            </Link>
          </div>
        </div>
        <Tabs items={items} className="mt-12 mb-8" />
      </Container>
    </Layout>
  );
};

export default DashboardPage;
