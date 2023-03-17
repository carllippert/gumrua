import type { NextPage } from "next";
import logo from "../public/gumrua.svg";
import Image from "next/image";
import Layout from "../components/layout";
import { useEffect, useState } from "react";

import { SafeOnRampKit, SafeOnRampProviderType } from "@safe-global/onramp-kit";
import MoneriumAdapter from "../utils/monerium-adapter";

// override SafeOnRampProviderType type of @safe-global/onramp-kit
declare module "@safe-global/onramp-kit" {
  export enum SafeOnRampProviderType {
    Monerium = 1,
  }
}

interface MoneriumProviderConfig {
  onRampProviderConfig: {};
}

class PatchedSafeOnRampKit extends SafeOnRampKit {
  static async init(
    providerType: SafeOnRampProviderType,
    config: {}
  ): Promise<SafeOnRampKit> {
    let client;
    switch (providerType) {
      case SafeOnRampProviderType.Monerium:
        client = new MoneriumAdapter();
        break;
      default:
        throw new Error("Provider type not supported");
    }
    await client.init();
    return new SafeOnRampKit(client);
  }
}

const Home: NextPage = () => {
  const [safeOnRamp, setSafeOnRamp] = useState<SafeOnRampKit>();

  useEffect(() => {
    const initSafeOnRamp = async () => {
      // @ts-ignore
      const safeOnRamp = await PatchedSafeOnRampKit.init(
        SafeOnRampProviderType.Monerium,
        {
          onRampProviderConfig: {},
        }
      );

      setSafeOnRamp(safeOnRamp);
    };

    initSafeOnRamp();
  }, []);

  const onConnectMonerium = async () => {
    if (!safeOnRamp) return;

    await safeOnRamp.open({
      element: "",
      walletAddress: "",
      networks: [],
    });
  };

  return (
    <Layout>
      <div className="w-full md:ml-6 md:pr-6 pl-1 md:-mt-8">
        <Image src={logo} width="1500" height="300" alt="gumrua logo" />
      </div>

      <div className="border-y-2 border-solid border-black h-20">
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
          <button
            onClick={onConnectMonerium}
            className="text-white bg-black border-l-2 border-black font-3xl hover:text-black h-full w-40 hover:bg-[#ff90e8]"
          >
            Connect Monerium
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
