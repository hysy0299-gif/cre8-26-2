import Link from "next/link";
import { Logo } from "@/components/logo";

/**
 * LANDING — 진입 화면. 여기서 메인화면(/home)으로 넘어간다.
 * 진입 연출(타이포 reveal / 이미지)은 Interaction 단계에서 붙인다.
 * 크기·배치 값은 Layout 단계 전까지 임시다.
 */
export default function LandingPage() {
  return (
    <div data-screen="landing">
      <section data-block="landing-visual" aria-label="Landing visual" />
      <section data-block="landing-mark" aria-label="Wordmark">
        <Logo variant="lockup" className="w-[40vw]" />
      </section>
      <Link href="/home" data-block="enter">
        ENTER
      </Link>
    </div>
  );
}
