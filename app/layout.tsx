import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "LifeCFO — Your world-class personal CFO", template: "%s · LifeCFO" },
  description: "Calm, transparent financial planning and educational decision support.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title:"LifeCFO — Your world-class personal CFO", description:"Calm, transparent financial planning and educational decision support.", images:[{url:"/og.png",width:1200,height:630}] },
  twitter: { card:"summary_large_image", title:"LifeCFO — Your world-class personal CFO", images:["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
