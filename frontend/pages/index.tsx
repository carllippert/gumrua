import type { NextPage } from "next";
import Head from "next/head";
import Upload from "../components/c_uppload";
import Header from "../components/c_head";
import logo from "../public/gumrua1.png";
import Image from "next/image";
import Layout from "../components/c_layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Image src={logo} width="1200" height="400" alt="gumrua logo" />
      <div className="pt-12">
        <Upload />
      </div>
    </Layout>
  );
};

export default Home;
