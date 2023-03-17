import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SafeOnRampProviderType } from "@safe-global/onramp-kit";

import { useAccount, useSignMessage } from "wagmi";
import { ExtendedSafeOnRampKit } from "../utils/extended-safe-on-ramp";

interface OnRampState {
  iban: string | undefined;
  loading: boolean;
  connect: () => Promise<void>;
  offRamp: (amount: number) => Promise<void>;
}

const OnRampContext = createContext<OnRampState | undefined>(undefined);

export const OnRampProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();

  const [loading, setLoading] = useState(true);
  const [safeOnRamp, setSafeOnRamp] = useState<ExtendedSafeOnRampKit>();
  const [iban, setIban] = useState<string>();

  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    const initSafeOnRamp = async () => {
      const safeOnRamp = await ExtendedSafeOnRampKit.init(
        SafeOnRampProviderType.Monerium,
        {
          onRampProviderConfig: {
            events: {
              onLoaded(iban) {
                setIban(iban);
                setLoading(false);
              },
            },
          },
        }
      );

      setSafeOnRamp(safeOnRamp);
    };

    initSafeOnRamp();
  }, []);

  const onConnect = async () => {
    if (!safeOnRamp || !address) return;

    await safeOnRamp.open({
      element: "",
      walletAddress: address,
      networks: [],
    });
  };

  const offRamp = async (amount: number) => {
    if (!safeOnRamp || !address) return;

    const message = `Send EUR ${amount} to ${iban} at ${new Date().toISOString()}`;
    const signature = await signMessageAsync({
      message,
    });

    await safeOnRamp.offRamp({
      address,
      message,
      signature,
    });
  };

  return (
    <OnRampContext.Provider
      value={{ iban, loading, offRamp, connect: onConnect }}
    >
      {children}
    </OnRampContext.Provider>
  );
};

export const useOnRamp = () => {
  const context = useContext(OnRampContext);

  if (context === undefined) {
    throw new Error("useApiClient must be used within an AuthProvider");
  }

  return context;
};
