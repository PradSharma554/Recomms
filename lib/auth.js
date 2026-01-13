import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectToDatabase from "./db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        try {
          await connectToDatabase();
          const userExists = await User.findOne({ email });
          if (!userExists) {
            await User.create({
              name,
              email,
              image,
            });
          }
          return true;
        } catch (error) {
          console.log("Error checking if user exists: ", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      // Add user ID to session from DB
      try {
        await connectToDatabase();
        if (session.user && session.user.email) {
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
          }
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
