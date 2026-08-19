import type { SVGProps } from "react";

/**
 * GRIT 로고. 원본 SVG를 그대로 인라인해서 currentColor를 상속받는다.
 * <img>가 아니라 인라인인 이유 — 배경에 따라 잉크색이 바뀌어야 하기 때문.
 *
 * lockup   심볼 + 워드마크 (기본)
 * symbol   심볼만
 * wordmark GRIT 글자만
 */
type LogoVariant = "lockup" | "symbol" | "wordmark";

const VIEW_BOX: Record<LogoVariant, string> = {
  lockup: "0 0 1333.63 258.64",
  symbol: "0 0 258.63 258.64",
  wordmark: "368.31 9.27 965.32 240.17",
};

const SYMBOL_PATH =
  "M258.63,32.33c0,17.86-14.48,32.33-32.33,32.33h-64.66c-17.85,0-32.33,14.48-32.33,32.33v64.66c0,17.85-14.47,32.33-32.33,32.33s-32.33,14.47-32.33,32.33-14.47,32.33-32.33,32.33S0,244.16,0,226.31V96.99c0-17.85,14.47-32.33,32.32-32.33s32.33-14.47,32.33-32.33S79.13,0,96.98,0h129.32c17.85,0,32.33,14.48,32.33,32.33Z";

const G_PATH =
  "M643.5,249.44h-155.11c-66.21,0-120.08-53.87-120.08-120.08S422.17,9.27,488.38,9.27h140.11v30h-140.11c-49.67,0-90.08,40.41-90.08,90.08s40.41,90.08,90.08,90.08h125.11v-75.08h-90.08v-30h120.08v135.08Z";

const R_PATH =
  "M949.75,79.32c0-38.62-30.3-70.05-67.55-70.05h-202.65v240.1h30v-100h151.44l58.76,30.78v69.22h30v-87.37l-37.8-19.8c22.37-11.43,37.8-35.32,37.8-62.88ZM709.55,39.27h172.65c20.7,0,37.55,17.97,37.55,40.05s-16.85,40.05-37.55,40.05h-172.65V39.27Z";

interface LogoProps extends Omit<SVGProps<SVGSVGElement>, "viewBox"> {
  variant?: LogoVariant;
}

export function Logo({ variant = "lockup", ...props }: LogoProps) {
  const showSymbol = variant !== "wordmark";
  const showWordmark = variant !== "symbol";

  return (
    <svg
      viewBox={VIEW_BOX[variant]}
      fill="currentColor"
      role="img"
      aria-label="GRIT"
      {...props}
    >
      {showSymbol ? <path d={SYMBOL_PATH} /> : null}
      {showWordmark ? (
        <>
          <path d={G_PATH} />
          <path d={R_PATH} />
          <rect x="994.8" y="9.28" width="30" height="240.09" />
          <polygon points="1333.63 9.27 1333.63 39.27 1214.48 39.27 1214.48 249.37 1184.48 249.37 1184.48 39.27 1065.32 39.27 1065.32 9.27 1333.63 9.27" />
        </>
      ) : null}
    </svg>
  );
}
