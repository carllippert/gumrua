import Head from "next/head";
import Header from "./header";

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
      <Header />
      {children}
      <footer className="h-32">Footer</footer>
    </div>
  );
};
export default Layout;
