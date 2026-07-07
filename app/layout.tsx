import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "만원 사이트 | 구글맵 링크로 만드는 웹사이트",
  description: "구글맵 링크 하나만 넣으면 AI가 자동으로 완성도 높은 랜딩페이지를 생성하고 배포해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative z-[1000]">
          <Navbar />
        </div>
        <main className="relative z-[1]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}