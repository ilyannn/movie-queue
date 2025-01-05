import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Queue",
  description: "A simple movie queue app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/q-180.png" />
        <link rel="icon" sizes="180x180" href="/icons/q-180.png" />
        {/* <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
