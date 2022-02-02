import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import axios from "axios";

const settings = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(account.provider);
      if (account.provider === "google") {
        const { accessToken, idToken } = account;
        console.log(`accessToken: ${accessToken}, idToken: ${idToken}`);

        try {
          const response = await axios.post(
            `${process.env.DJANGO_URL}/api/social/login/google/`,
            {
              access_token: accessToken,
              id_token: idToken
            }
          );

          const { access_token } = response.data;
          user.accessToken = access_token;

          return true;
        } catch (error) {
          return false;
        }
      }
      if (account.provider === "github") {
        console.log("start github login!!");
        console.log(`account.access_token: ${account.access_token}`);
        const { access_token, idToken } = account;

        console.log(`access_token: ${access_token}, idToken: ${idToken}`);

        for (const key in account) {
          console.log(`account.${key}: ${account[key]}`);
        }

        try {
          const response = await axios.post(
            `${process.env.DJANGO_URL}/api/social/login/github/`,
            {
              access_token: account.access_token
              // id_token: idToken
            }
          );

          const { access_token } = response.data;
          user.accessToken = access_token;

          for (const key in response.data) {
            console.log(`response.data.${key}: ${response.data[key]}`);
          }

          return true;
        } catch (error) {
          console.log("error!!: " + error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        for (const key in token) {
          console.log(`token.${key}: ${token[key]}`);
        }
        const { accessToken } = user;
        console.log(`accessToken: ${accessToken}`);

        token.accessToken = accessToken;
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log(`user: ${user}`);
      for (const key in user) {
        console.log(`user.${key}: ${user[key]}`);
      }
      console.log(`token: ${token}`);
      for (const key in token) {
        console.log(`token.${key}: ${token[key]}`);
      }
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
};

export default (req, res) => NextAuth(req, res, settings);
