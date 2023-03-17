import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SafeOnRampKit, SafeOnRampProviderType } from "@safe-global/onramp-kit";

import {
  MoneriumAdapter,
  MoneriumProviderConfig,
} from "../utils/monerium-adapter";

declare module "@safe-global/onramp-kit" {
  export enum SafeOnRampProviderType {
    Monerium = 1,
  }
}

// @ts-ignore
class PatchedSafeOnRampKit extends SafeOnRampKit {
  static async init(
    providerType: SafeOnRampProviderType,
    config: MoneriumProviderConfig
  ): Promise<SafeOnRampKit> {
    let client;
    switch (providerType) {
      case SafeOnRampProviderType.Monerium:
        client = new MoneriumAdapter(config);
        break;
      default:
        throw new Error("Provider type not supported");
    }
    await client.init();
    return new SafeOnRampKit(client);
  }
}

interface OnRampState {
  iban: string | undefined;
  connect: () => Promise<void>;
}

const OnRampContext = createContext<OnRampState | undefined>(undefined);

export const OnRampProvider = ({ children }: { children: ReactNode }) => {
  const [safeOnRamp, setSafeOnRamp] = useState<SafeOnRampKit>();
  const [iban, setIban] = useState<string>();

  useEffect(() => {
    const initSafeOnRamp = async () => {
      const safeOnRamp = await PatchedSafeOnRampKit.init(
        SafeOnRampProviderType.Monerium,
        {
          onRampProviderConfig: {
            events: {
              onLoaded(iban) {
                setIban(iban);
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
    if (!safeOnRamp) return;

    await safeOnRamp.open({
      element: "",
      walletAddress: "",
      networks: [],
    });
  };

  return (
    <OnRampContext.Provider value={{ iban, connect: onConnect }}>
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
