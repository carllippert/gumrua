import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
// import styles from "../styles/Home.module.css";
import Upload from "../components/upload";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GumRua</title>
        <meta content="web3 gumroad" name="description" />
        <link
          href="https://assets-global.website-files.com/6171b265e5c8aa59b42c3472/619bf6d5140958874014528c_favicon.png"
          rel="icon"
        />
      </Head>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-9xl">GUMRUA</div>
        <Upload />
      </main>
    </div>
  );
};

export default Home;
