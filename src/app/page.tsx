import Link from "next/link";
import { site } from "@/data/site";

/**
 * LANDING — 진입 화면. 여기서 메인화면(/home)으로 넘어간다.
 * 진입 연출(타이포 reveal / 이미지)은 Interaction 단계에서 붙인다.
 */
export default function LandingPage() {
  return (
    <div data-screen="landing">
      <section data-block="landing-visual" aria-label="Landing visual" />
      <section data-block="landing-mark" aria-label="Wordmark">
        {site.name}
      </section>
      <Link href="/home" data-block="enter">
        ENTER
      </Link>
    </div>
  );
}
