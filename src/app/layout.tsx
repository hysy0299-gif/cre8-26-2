import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

/** 루트 레이아웃은 문서 껍데기만 — 네비는 (site) 그룹에서만 붙는다 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
