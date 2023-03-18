import { ConnectButton } from "@rainbow-me/rainbowkit";
export const CustomConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="text-black border-l-2 border-black font-3xl h-full lg:w-40 w-24 hover:bg-[#ff90e8]"
                  >
                    Login
                  </button>
                );
              } else {
                return null;
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
