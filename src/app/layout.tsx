import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { CustomerProvider } from "@/context/CustomerContext";
import { Toaster } from "react-hot-toast";
import { CategoryProvider } from "@/context/CategoryContext";
import { GlobalUIProvider } from "@/context/GlobalUIContext";
import { CartPreviewProvider } from "@/context/CartPreviewContext";
import FloatingCartPreview from "@/components/ui/FloatingCartPreview";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/globals/GoogleTagManager";
import GoogleTranslateScript from "@/components/globals/GoogleTranslateScript";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pripriya Nursery – Buy Indoor & Outdoor Plants Online",
  description:
    "Shop a wide variety of indoor and outdoor plants at Pripriya Nursery. Fresh plants, expert care tips, and doorstep delivery for your home & garden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
        <GoogleTranslateScript />
      </head>
      <body className={`${dmSans.variable} antialiased`}>
        <Toaster />
        <GlobalUIProvider>
          <CustomerProvider>
            <CategoryProvider>
              <CartPreviewProvider>
                {children}
                <FloatingCartPreview />
              </CartPreviewProvider>
            </CategoryProvider>
          </CustomerProvider>
        </GlobalUIProvider>
        <GoogleTagManagerNoScript />
      </body>
    </html>
  );
}
