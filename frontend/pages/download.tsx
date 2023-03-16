import Head from "next/head";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/layout";

const Download = () => {
  const [message, setMessage] = useState();

  const router = useRouter();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnecting, isDisconnected } = useAccount();
  //   const [{ data: connectData }, connect] = useConnect()
  const { signMessage, signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  //   const [{ data: accountData }] = useAccount();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/downloads");
    }
  }, [session]);

  const handleLogin = async () => {
    try {
      await connect({ connector: connectors[0] });

      const callbackUrl = "/downloads";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const res = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
      if (res && res.url) {
        router.push("/downloads");
      } else {
        throw new Error("Invalid sign in attempt");
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Layout>
      <div>
        <h1>Members Only</h1>
        <p>You have to own [Insert NFT name] to access the gallery.</p>
        <button onClick={handleLogin}>Sign In With Ethereum</button>
      </div>
    </Layout>
  );
};

export default Download;
