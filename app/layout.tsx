import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./context/authProvider";
import { Toaster } from "@/components/ui/sonner"
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat app Made By Jooo ",
};
/* authConfig */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-primary_colors-black_2 text-primary_colors-white_1 ${session ? 'grid grid-cols-[minmax(400px,_430px)_auto] gap-4' : 'flex items-center justify-center h-screen'}`}
      >
        <AuthProvider>
          {session ? <Sidebar /> : null}
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}