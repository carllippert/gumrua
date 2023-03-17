import {
  SafeOnRampClient,
  SafeOnRampOpenOptions,
} from "@safe-global/onramp-kit/dist/src/types/index";
import {
  MoneriumClient,
  Chain,
  Network,
  PaymentStandard,
  OrderKind,
  Currency,
} from "@monerium/sdk";
import { SafeOffRampOptions } from "./extended-safe-on-ramp";

const CODE_CHALLENGE = "9Y__uhKapn7GO_ElcaQpd8C3hdOyqTzAU4VXyR2iEV0";
const CODE_VERIFIER = "12345678901234567890123456789012345678901234567890";

if (!process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_MONERIUM_CLIENT_ID is not defined");
}
const MONERIUM_CLIENT_ID = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;

if (!process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URL) {
  throw new Error("NEXT_PUBLIC_MONERIUM_REDIRECT_URL is not defined");
}
const MONERIUM_REDIRECT_URL = process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URL;

export interface MoneriumProviderConfig {
  onRampProviderConfig: {
    events: {
      onLoaded: (iban: string | undefined) => void;
    };
    getConnectedWalletAddress: () => string | undefined;
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
    let iban: string | undefined;

    try {
      this.client = new MoneriumClient();

      // Get refresh token from local storage
      const address =
        this.config.onRampProviderConfig.getConnectedWalletAddress();
      const savedRefreshToken = this.getRefreshToken(address || "");

      if (savedRefreshToken) {
        await this.client.auth({
          client_id: MONERIUM_CLIENT_ID,
          refresh_token: savedRefreshToken,
        });

        // Get user data
        iban = await this.getIban();

        // Save refresh token to local storage
        this.saveRefreshToken(address || "");
      } else {
        // Get code from URL
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        const address = searchParams.get("state");

        if (code) {
          // Authenticate user with authentication code
          await this.client.auth({
            client_id: MONERIUM_CLIENT_ID,
            code,
            code_verifier: CODE_VERIFIER,
            redirect_uri: MONERIUM_REDIRECT_URL,
          });

          // Get user data
          iban = await this.getIban();

          // Save refresh token to local storage
          this.saveRefreshToken(address || "");
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }

    this.config.onRampProviderConfig.events.onLoaded(iban);
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
        redirect_uri: MONERIUM_REDIRECT_URL,
        // immediately connect a wallet by adding these optional parameters:
        // TODO: get address from options
        // address: options.walletAddress,
        // signature:
        // "0xVALID_SIGNATURE_2c23962f5a2f189b777b6ecc19a395f446c86aaf3b5d1dc0ba919ddb34372f4c9f0c8686cfc2e8266b3e4d8d1bc7bc67c34a11f9dfe8e691b",
        chain: Chain.gnosis,
        network: Network.chiado,
        state: options.walletAddress,
      });

      const href = new URL(authFlowUrl);
      href.searchParams.set("code_challenge", CODE_CHALLENGE);

      window.location.href = href.toString();
    } catch {
      console.log("Error trying to create a new Monerium session");
    }
  }

  async getIban() {
    if (!this.client) return;

    const context = await this.client.getAuthContext();
    const profileId = context.profiles[0].id;
    const profile = await this.client.getProfile(profileId);

    const account = profile.accounts.find(
      (account) =>
        account.chain === "gnosis" &&
        account.standard === "iban" &&
        account.network === "chiado"
    );

    return account?.iban;
  }

  getRefreshToken(address: string) {
    return localStorage.getItem(`monerium-refresh-token-${address}`);
  }

  saveRefreshToken(address: string) {
    if (!this.client) return;

    localStorage.setItem(
      `monerium-refresh-token-${address}`,
      this.client.bearerProfile?.refresh_token || ""
    );
  }

  async offRamp(options: SafeOffRampOptions) {
    if (!this.client) return;

    const order = await this.client.placeOrder({
      chain: Chain.gnosis,
      network: Network.chiado,
      message: options.message,
      signature: options.signature,
      address: options.address,
      amount: options.amount.toString(),
      kind: OrderKind.redeem,
      memo: "",
      currency: Currency.eur,
      counterpart: {
        details: {
          firstName: "Test",
          lastName: "Test",
        },
        identifier: {
          standard: PaymentStandard.iban,
          iban: options.iban,
        },
      },
    });

    console.log("Order: ", order);
  }

  /**
   * This method close the onramp widget
   */
  async close() {
    console.log("Method not implemented.");
  }
}
