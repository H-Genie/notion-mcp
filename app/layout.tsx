import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion + Gmail (Ollama)",
  description: "Ollama와 Notion MCP 연동 Next.js 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
