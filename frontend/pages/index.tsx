import type { NextPage } from "next";
import Head from "next/head";
import Upload from "../components/uploadImage";
import Header from "../components/header";
import logo from "../public/gumrua.svg";
import Image from "next/image";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="w-full md:ml-6 md:pr-6 pl-1 md:-mt-8">
        <Image
          src={logo}
          width="1500"
          height="300"
          alt="gumrua logo"
          // className="bg-pink-200"
        />
      </div>

      <div className="border-y-2 border-solid border-black h-20">
        <div className="flex flex-row h-full justify-center">
          {/* a button that is black text that has an underline when hovered */}
          <button className="text-black font-2xl hover:underline hover:underline-offset-4 h-full w-32">
            README
          </button>
          <div className="flex-1 h-full" />
          <button className="text-white bg-black border-l-2 border-black font-3xl hover:text-black h-full w-40 hover:bg-[#ff90e8]">
            Start Selling
          </button>
        </div>
      </div>
      <div className="h-[550px] bg-pink-200 flex flex-row border-solid border-black border-b-2">
        <div className="flex-1 bg-[#ff90e8] border-r-2 border-black border-solid">
          Copy
        </div>
        <div className=" flex-1 bg-[#ffc900] border-r-2 border-black border-solid">
          Copy
        </div>
      </div>
    </Layout>
  );
};

export default Home;
