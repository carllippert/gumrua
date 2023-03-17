import { ethers } from "ethers";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { Button } from "../components/basic/button";
import { Spinner } from "../components/basic/spinner";
import { Tabs } from "../components/basic/tabs";
import Container from "../components/container";
import { CreatedProducts } from "../components/created-products";
import Layout from "../components/layout";
import { PurchasedProducts } from "../components/purchased-products";
import { EURE_TOKEN_ADDRESS } from "../constants/addresses";
import { useOnRamp } from "../context/on-ramp-provider";

const BalanceBanner = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  console.log("Adderess: ", address);

  const { data: eureBalance } = useBalance({
    token: EURE_TOKEN_ADDRESS[chain?.id ?? 31337],
    address,
  });

  const { data: daiBalance } = useBalance({
    address,
  });

  return (
    <div className="bg-accent/20 px-4 py-4 flex justify-center gap-4 items-center mb-2">
      <p>
        xDAI Balance:{" "}
        <span className="font-bold">
          {Number(ethers.utils.formatEther(daiBalance?.value || 0)).toFixed(4)}
        </span>
      </p>
      <p>
        EURe Balance:{" "}
        <span className="font-bold">
          {ethers.utils.formatEther(eureBalance?.value || 0)}
        </span>
      </p>
    </div>
  );
};

const IbanBanner = () => {
  const { connect, iban, loading } = useOnRamp();

  if (loading) {
    return (
      <div className="bg-secondary/20 px-4 py-4 flex justify-center gap-4 items-center min-h-[80px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 px-4 py-4 flex justify-between gap-4 items-center">
      {iban ? (
        <div>
          <p>
            Your IBAN: <span className="font-bold">{iban}</span>
          </p>
          <p>You can obtain crypto by sending a bank transfer to this IBAN</p>
        </div>
      ) : (
        <>
          <p>
            Create an IBAN to simplify your experience on Gumrua. As a buyer,
            you can obtain crypto by simply sending a bank transfer to this
            IBAN.
          </p>
          <Button onClick={connect}>Create IBAN</Button>
        </>
      )}
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

        <BalanceBanner />
        <IbanBanner />

        <Tabs items={items} className="mt-8 mb-8" />
      </Container>
    </Layout>
  );
};

export default DashboardPage;
