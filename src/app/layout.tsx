import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import NavMenu from "@/components/NavMenu";
import seedDatabase from "@/utils/seedDatabase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Management",
  description: "Demo Product Management web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <main className="container mx-auto flex flex-col gap-4">
            <NavMenu />
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
