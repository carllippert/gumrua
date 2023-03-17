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

export interface SafeOffRampOptions {
  address: string;
  message: string;
  signature: string;
}

// @ts-ignore
export class ExtendedSafeOnRampKit extends SafeOnRampKit {
  client: MoneriumAdapter;

  constructor(_client: MoneriumAdapter) {
    super(_client);
    this.client = _client;
  }

  static async init(
    providerType: SafeOnRampProviderType,
    config: MoneriumProviderConfig
  ): Promise<ExtendedSafeOnRampKit> {
    let client;

    switch (providerType) {
      case SafeOnRampProviderType.Monerium:
        client = new MoneriumAdapter(config);
        break;
      default:
        throw new Error("Provider type not supported");
    }
    await client.init();
    return new ExtendedSafeOnRampKit(client);
  }

  async offRamp(options: SafeOffRampOptions) {
    return this.client.offRamp(options);
  }
}
