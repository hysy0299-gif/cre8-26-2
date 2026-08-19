import Image from "next/image";
import Link from "next/link";
import { MorphingText } from "@/components/morphing-text";

/**
 * LANDING — 진입 화면.
 * 벽 사진 위에 "Be Experimental"이 3초 떠 있다가 "GRIT"으로 녹아 바뀐다.
 * 화면 아무 데나 누르면 메인화면으로 넘어간다.
 */
export default function LandingPage() {
  return (
    <Link
      href="/home"
      data-screen="landing"
      aria-label="Enter"
      className="relative block h-dvh w-full overflow-hidden"
    >
      <Image
        src="/img/landing-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative flex h-full items-center justify-center px-[var(--page-margin)]">
        <MorphingText
          from="Be Experimental"
          to="GRIT"
          holdSeconds={3}
          className="text-ink h-[1.15em] text-[clamp(2rem,7vw,6.5rem)] font-bold tracking-tight"
        />
      </div>
    </Link>
  );
}
