import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { Button } from "../components/basic/button";
import { Spinner } from "../components/basic/spinner";
import Container from "../components/container";
import Layout from "../components/layout";
import Navbar from "../components/navbar";
import { EURE_TOKEN_ADDRESS } from "../constants/addresses";
import { useOnRamp } from "../context/on-ramp-provider";

import cx from "classnames";
import { Input } from "../components/basic/input";
import { useForm } from "react-hook-form";
import { CopyButton } from "../components/copy-button";

interface BalanceBannerProps {
  daiBalance: ethers.BigNumber;
  eureBalance: ethers.BigNumber;
}

const BalanceBanner = ({ daiBalance, eureBalance }: BalanceBannerProps) => {
  return (
    <div className="bg-accent/20 px-4 py-4 flex justify-center gap-4 items-center mb-4">
      <p>
        xDAI Balance:{" "}
        <span className="font-bold">
          {Number(ethers.utils.formatEther(daiBalance)).toPrecision(4)}
        </span>
      </p>
      <p>
        EURe Balance:{" "}
        <span className="font-bold">
          {ethers.utils.formatEther(eureBalance)}
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
    <div
      className={cx(
        "bg-secondary/20 px-4 py-4 gap-4 flex flex-col items-center"
      )}
    >
      {iban ? (
        <>
          <p>Get crypto by sending a bank transfer to this IBAN</p>
          <p className="text-center mt-2">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-xl">{iban}</span>
              <CopyButton
                text={iban}
                label="Copy"
                size="xs"
                variant="outline"
              />
            </div>
          </p>
          <a
            href="https://sandbox.monerium.dev/mockbank"
            target="_blank"
            rel="noreferrer"
            className="mt-4"
          >
            <Button>Send bank transfer</Button>
          </a>
        </>
      ) : (
        <>
          <p className="text-center">
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

interface OffRampFields {
  iban: string;
  amount: string;
}

const BuyCryptoPage = () => {
  const { offRamp } = useOnRamp();

  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: eureBalance, refetch } = useBalance({
    token: EURE_TOKEN_ADDRESS[chain?.id ?? 31337],
    address,
  });

  const { data: daiBalance } = useBalance({
    address,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OffRampFields>({
    defaultValues: {
      iban: "GR1601101250000000012300695",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await offRamp(data.iban, Number(data.amount));
    await refetch();
    reset();
  });

  return (
    <Layout>
      <Navbar currentPage="crypto" />
      <Container className="mt-10 max-w-[50rem]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Account</h1>
          {/* <Link href="/dashboard">
            <a>
              <Button>Dashboard</Button>
            </a>
          </Link> */}
        </div>

        <BalanceBanner
          daiBalance={daiBalance?.value || BigNumber.from(0)}
          eureBalance={eureBalance?.value || BigNumber.from(0)}
        />

        <h2 className="text-2xl font-bold mt-8 mb-4">Buy crypto</h2>
        <IbanBanner />

        <h2 className="text-2xl font-bold mb-4 mt-8">Sell crypto</h2>
        <p>Convert your EURe to euros in your bank account</p>
        <form className="flex flex-col gap-2 mt-4 w-full" onSubmit={onSubmit}>
          <Input
            className="flex-1"
            label="Enter your IBAN"
            {...register("iban", { required: "IBAN is required" })}
            error={errors.iban?.message}
          />
          <Input
            type="number"
            className="flex-1"
            label="Amount"
            error={
              errors.amount?.type === "max"
                ? "Amount exceeds balance"
                : errors.amount?.message
            }
            {...register("amount", {
              required: "Amount is required",
              max: ethers.utils.formatEther(eureBalance?.value || 0),
            })}
          />
          <Button
            type="submit"
            className="mt-2"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Send
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default BuyCryptoPage;
