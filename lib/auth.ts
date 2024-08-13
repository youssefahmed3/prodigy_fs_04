import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { createUser, getUserByEmail, updateUserProviderByEmail } from "@/lib/actions/user.actions";
import { hashPassword } from "./isValidPassword";
import connectToDb from "./mongodb";

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "",
            credentials: {
                email: {
                    label: "Email address",
                    type: "email",
                    placeholder: "Enter your email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) return null;

                const dbUser = await getUserByEmail(credentials.email)


                if (dbUser && dbUser.password === await hashPassword(credentials.password)) {
                    return dbUser as User
                }

                return null

            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "github") {
                await connectToDb();
                try {
                    // Check if the user already exists in the database
                    let existingUser = await getUserByEmail(user.email as string);

                    if (!existingUser) {
                        // If the user doesn't exist, create a new user
                        let newUser = await createUser({
                            username: user.name as string,
                            email: user.email as string,
                            provider: "github",
                            avatar: user.image as string | ''
                        })
                        console.log("sign in success", newUser);
                        
                    } else {
                        // If the user already exists, update their GitHub account ID
                        let updatedUser = await updateUserProviderByEmail(existingUser.email, 'github')
                        console.log("updated");
                    }

                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }

            if (account?.provider === "google") {
                await connectToDb();
                try {
                    // Check if the user already exists in the database
                    let existingUser = await getUserByEmail(user.email as string);

                    if (!existingUser) {
                        // If the user doesn't exist, create a new user
                        let newUser = await createUser({
                            username: user.name as string,
                            email: user.email as string,
                            provider: "google",
                            avatar: user.image as string | ''
                        })
                        console.log("sign in success", newUser);
                        
                    } else {
                        // If the user already exists, update their GitHub account ID
                        let updatedUser = await updateUserProviderByEmail(existingUser.email, 'google')
                        console.log("updated");
                    }

                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }

            if (account?.provider === "credentials") {
                return true;
            }

            // If the provider is not "github" or "credentials", disallow sign in
            return false;
        },
        
        async session({ session, token }) {
            console.log("Session callback - session:", session, "token:", token);

            try {
                await connectToDb();
                // Find the user in MongoDB
                if(token.email) {
                    const dbUser = await getUserByEmail(token.email);
    
                    // Add the user from MongoDB to the session
                    session.user = dbUser;
                    // session.user?.image = token.picture
                    console.log("New", dbUser);
                }

                return session;
            } catch (error: any) {
                console.log(error.message);
                return session;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET, // Ensure you have this set in your .env file

}



