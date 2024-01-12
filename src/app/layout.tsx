import "~/styles/globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Inter } from "next/font/google";
import { Header } from "~/app/components/Header";

import SessionProvider from "~/app/components/SessionProvider";
import { getServerAuthSession } from "~/server/auth";
import { GenderModal } from "./components/GenderModal";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "FCIT Groups",
  description: "Get your FCIT Group link here!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <MantineProvider defaultColorScheme="dark">
            <Header />
            {session?.user.gender === 0 && <GenderModal />}
            < Notifications position="top-center"/>
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
