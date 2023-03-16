import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    try {
      const response = await getCsrfToken();
      if (response) {
        return response;
      } else {
        throw new Error("No CSRF token found");
      }
    } catch (e) {
      throw e;
    }
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    const res = await signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature,
      callbackUrl: "/dashboard",
    });

    if (res && res.url) {
      return true;
    } else {
      return false;
    }
  },
  signOut: async () => {
    await signOut();
  },
});
