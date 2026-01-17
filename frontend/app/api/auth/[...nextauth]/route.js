import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        // Adding Credentials Provider for testing/fallback if needed
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a basic mock implementation for testing if Google keys aren't ready
                // In a real app, you'd verify against DB password hash
                if (credentials?.email === "test@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "Test User", email: "test@example.com" }
                }
                return null;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    await dbConnect();

                    // Check if user exists
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create new user
                        await User.create({
                            name: user.name,
                            email: user.email,
                            role: 'user', // Default role
                        });
                        console.log(`New user created: ${user.email}`);
                    }
                    return true;
                } catch (error) {
                    console.error("Error checking/creating user in MongoDB:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            // You can add user ID or role to session here if needed
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    },
});

export { handler as GET, handler as POST };
