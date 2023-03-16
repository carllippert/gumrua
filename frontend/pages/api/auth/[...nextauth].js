// import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export default async function auth(req, res) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const domain = process.env.DOMAIN;
          if (siwe.domain !== domain) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || "");
          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  // if (
  //   req &&
  //   req.query &&
  //   req.query.nextauth &&
  //   req.query.nextauth.includes("signin")
  // ) {
  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub;
        session.user.name = token.sub;
        return session;
      },
    },
  });
  // } else {
  //   return { error: "Something Diead" };
  // }
}
