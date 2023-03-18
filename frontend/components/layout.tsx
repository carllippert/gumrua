import Head from "next/head";
import Header from "./header";
import { NextSeo } from "next-seo";
// import { CustomSwitchChain } from './CustomConnect';

const Layout = ({ children }: { children: any }) => {
  return (
    <div data-theme="cupcake" className="min-h-screen flex flex-col">
      <Head>
        <title>Gumrua - web3 gumroad</title>
        <meta content="web3 gumroad" name="description" />
        <link
          href="https://assets-global.website-files.com/6171b265e5c8aa59b42c3472/619bf6d5140958874014528c_favicon.png"
          rel="icon"
        />
      </Head>
      <NextSeo
        title="Gumrua"
        openGraph={{
          title: "Gumrua",
          description: "web3 gumroad",
          images: [
            {
              url: "https://qqhuhpdwqoguhxekruva.supabase.co/storage/v1/object/public/public/gumrua_seo.png",
              width: 1200,
              height: 630,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
          ],
          siteName: "Gumrua",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />

      {/* <Header /> */}
      <main className="flex-1">{children}</main>
      <footer className="h-32">{/* <CustomSwitchChain /> */}</footer>
    </div>
  );
};
export default Layout;
