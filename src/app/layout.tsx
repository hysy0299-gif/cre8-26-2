import type { Metadata } from "next";
import { IdleReset } from "@/components/idle-reset";
import { site } from "@/data/site";
import { helveticaNeue } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

/**
 * 루트 레이아웃은 문서 껍데기만 — 네비는 (site) 그룹에서만 붙는다.
 * IdleReset은 모든 화면에 걸어야 해서 여기 둔다.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={helveticaNeue.variable}>
      <body>
        {children}
        <IdleReset />
      </body>
    </html>
  );
}
