import type { NextPage } from "next";
import logo from "../public/gumrua.svg";
import og_girl from "../public/og_girl.png";
import Image from "next/image";
import Layout from "../components/layout";
import Link from "next/link";
import { Button } from "../components/basic/button";
import CustomConnect from "../components/customConnect";
import Navbar from "../components/navbar";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="w-full md:ml-6 md:pr-6 pl-1">
        <Image src={logo} width="1500" height="280" alt="gumrua logo" />
      </div>

      <Navbar currentPage="index" />
      {/* <div className="border-y-2 border-solid border-black h-20">
        <div className="flex flex-row h-full justify-center">
          <a
            href="https://github.com/carllippert/gumrua"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center pt-6 text-black font-2xl hover:underline hover:underline-offset-4 h-full w-32"
          >
            README
          </a>
          <div className="flex-1 h-full" />
          <CustomConnect />
          <Link href="/create">
            <button className="text-white bg-black border-l-2 border-black font-3xl hover:text-black h-full w-40 hover:bg-[#ff90e8]">
              Start Selling
            </button>
          </Link>
        </div>
      </div> */}
      {/* Hero */}
      <div className="flex lg:h-[550px] h-[1100px] m-0 w-full bg-blue-200 flex-col p-0 gap-0 lg:flex-row border-solid border-black border-b-2">
        <div className="flex-1 w-full h-full bg-[#ff90e8] border-b-2 lg:border-b-0 border-black border-solid lg:border-r-2">
          <div className="mx-auto my-auto max-w-[40rem] mt-16 lg:px-12 px-4">
            <div className="md:text-8xl text-6xl font-semibold py-4">
              Go from 0 to €1
            </div>
            <div className=" py-6 text-2xl">
              With Gumrua, anyone on planet earth can start earning crypto. Just
              start with something simple, see what works, and grow from there.
            </div>
            <Button
              size="lg"
              className="hover:bg-[#ff90e8] border-2 mt-6 hover:text-black font-inherit  w-full"
            >
              Start Selling
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full h-full bg-[#ffc900]  border-black border-solid">
          <div className="lg:ml-20 lg:mt-6 mt-10">
            <Image
              src={og_girl}
              width="500"
              height="500"
              alt="gumrua logo"
              className=""
            ></Image>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
