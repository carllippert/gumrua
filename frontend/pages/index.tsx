import type { NextPage } from "next";
import Head from "next/head";
import Upload from "../components/Upload";
import Header from "../components/Header";
import logo from "../public/gumrua1.png";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div data-theme="cupcake" className="min-h-screen">
      <Head>
        <title>GumRua</title>
        <meta content="web3 gumroad" name="description" />
        <link
          href="https://assets-global.website-files.com/6171b265e5c8aa59b42c3472/619bf6d5140958874014528c_favicon.png"
          rel="icon"
        />
      </Head>
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* <div className="text-9xl">GUMRUA</div> */}
        <Image src={logo} width="600" height="200" />
        <div className="pt-12">
          <Upload />
        </div>
      </main>
    </div>
  );
};

export default Home;
