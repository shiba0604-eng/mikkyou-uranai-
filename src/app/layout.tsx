import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "密教占い ― 避凶の宿曜道",
  description: "宿曜占星術（二十七宿）による毎朝の凶日警告配信サービス。運気を下げる行動を徹底的に避ける。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#0d0620]">{children}</body>
    </html>
  );
}
