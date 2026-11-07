import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AccentBlobs from "@/components/AccentBlobs";
import PlaceholderWarning from "@/components/PlaceholderWarning";

export const metadata: Metadata = {
  title: "CAPITLESS — Zero-inventory RFQ on Uniswap v4",
  description:
    "A maker signs a quote. One transaction uses Uniswap v4 flash accounting to fill it — LP liquidity supplies the WETH, maker earns the spread. No inventory.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AccentBlobs />
        <Navbar />
        <main id="main-content">{children}</main>
        <PlaceholderWarning />
      </body>
    </html>
  );
}
