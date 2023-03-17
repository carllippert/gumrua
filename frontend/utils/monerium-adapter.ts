import {
  SafeOnRampClient,
  SafeOnRampOpenOptions,
} from "@safe-global/onramp-kit/dist/src/types/index";
import { MoneriumClient, Chain, Network, Profile } from "@monerium/sdk";

export interface MoneriumProviderConfig {
  onRampProviderConfig: {
    events: {
      onLoaded: (iban: string | undefined) => void;
    };
  };
}

/**
 * This class implements the SafeOnRampClient interface for the Stripe provider
 * @class StripeAdapter
 */
export class MoneriumAdapter implements SafeOnRampClient {
  client: MoneriumClient | undefined;
  config: MoneriumProviderConfig;

  /**
   * Initialize the MoneriumAdapter
   * @constructor
   * @param config The configuration object for the Monerium provider
   */
  constructor(config: MoneriumProviderConfig) {
    this.config = config;
  }

  async init() {
    this.client = new MoneriumClient();

    try {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        await this.client.auth({
          client_id: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID || "",
          code,
          code_verifier: "12345678901234567890123456789012345678901234567890",
          redirect_uri: "http://localhost:3000/",
        });

        // User is now authenticated, get authentication data
        const context = await this.client.getAuthContext();
        const profileId = context.profiles[0].id;
        const profile = await this.client.getProfile(profileId);
        console.log("Profile: ", profile);

        const account = profile.accounts.find(
          (account) =>
            account.chain === "gnosis" &&
            account.standard === "iban" &&
            account.network === "chiado"
        );
        const iban = account?.iban;
        console.log("Iban: ", iban);

        this.config.onRampProviderConfig.events.onLoaded(iban);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  /**
   * This method open the onramp widget with the provided options
   * @param options The options to open the onramp widget
   */
  async open(options: SafeOnRampOpenOptions) {
    if (!this.client) return;

    try {
      let authFlowUrl = this.client.getAuthFlowURI({
        client_id: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID || "",
        redirect_uri: "http://localhost:3000/",
        // immediately connect a wallet by adding these optional parameters:
        // address: "0x0000000000000000000000000000000000000000",
        // signature:
        // "0xVALID_SIGNATURE_2c23962f5a2f189b777b6ecc19a395f446c86aaf3b5d1dc0ba919ddb34372f4c9f0c8686cfc2e8266b3e4d8d1bc7bc67c34a11f9dfe8e691b",
        chain: Chain.gnosis,
        network: Network.chiado,
      });

      const href = new URL(authFlowUrl);
      href.searchParams.set(
        "code_challenge",
        "9Y__uhKapn7GO_ElcaQpd8C3hdOyqTzAU4VXyR2iEV0"
      );

      window.location.href = href.toString();
    } catch {
      console.log("Error trying to create a new Monerium session");
    }
  }

  /**
   * This method close the onramp widget
   */
  async close() {
    console.log("Method not implemented.");
  }
}
