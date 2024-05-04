import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tatsumakeeb",
  description:
    "A web game to test your ability to think quick and to test your fingers's agility on your keyboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-MFW7X4B7N3"
      ></Script>
      <Script id="ga-script">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MFW7X4B7N3');
        `}
      </Script>
      <body className={`${inter.className} p-5 h-full w-full`}>{children}</body>
    </html>
  );
}
