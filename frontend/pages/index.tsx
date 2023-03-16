import type { NextPage } from "next";
import Head from "next/head";
import Upload from "../components/upload";
import Header from "../components/header";
import logo from "../public/gumrua.svg";
import Image from "next/image";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Image src={logo} width="1200" height="400" alt="gumrua logo" />
      <div className="border-y-2  border-solid border-black h-16">
        {/* <Upload /> */}
      </div>
    </Layout>
  );
};

export default Home;
