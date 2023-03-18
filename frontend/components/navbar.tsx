import Link from "next/link";
import { CustomConnect } from "../components/customConnect";

const Navbar = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className="border-y-2 border-solid border-black h-20">
      <div className="flex flex-row h-full justify-center">
        <a
          href="https://github.com/carllippert/gumrua"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-center pt-6 text-black font-2xl hover:underline hover:underline-offset-4 h-full w-32"
        >
          README
        </a>
        <Link href="/dashboard">
          <div className="text-center pt-6 text-black font-2xl cursor-pointer hover:underline hover:underline-offset-4 h-full w-32">
            Dashboard
          </div>
        </Link>
        {/* <Link href="/dashboard">
          <div className="text-center pt-6 text-black font-2xl hover:underline hover:underline-offset-4 h-full w-32">
            Sales
          </div>
        </Link> */}
        <Link href="/catalog">
          <div className="text-center pt-6 text-black font-2xl cursor-pointer hover:underline hover:underline-offset-4 h-full w-32">
            Catalog
          </div>
        </Link>
        {currentPage !== "index" ? (
          <Link href="/">
            <div className="text-center pt-6 text-black font-2xl cursor-pointer hover:underline hover:underline-offset-4 h-full w-32">
              Home
            </div>
          </Link>
        ) : null}
        <div className="flex-1 h-full" />
        <CustomConnect />
        {currentPage === "create" ||
        currentPage === "dashboard" ||
        currentPage === "crypto" ? null : (
          <Link href={"/create"}>
            <button className="text-white bg-black border-l-2 border-black font-3xl hover:text-black h-full w-40 hover:bg-[#ff90e8]">
              Start Selling
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
