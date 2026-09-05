import { put, list } from "@vercel/blob";

/**
 * 관람객이 만든 홀드가 쌓이는 곳.
 *
 * 이미지는 PNG blob 하나로 올라가고, 이름·한마디·주소는 `index.json`
 * 한 장에 모인다. 벽은 그 index만 읽으면 되니 홀드가 몇 개가 되든
 * 요청은 한 번이고, 이미지는 브라우저가 알아서 캐시한다.
 *
 * 저장소는 Vercel Blob이다. 프로젝트에 Blob 스토어를 붙이면
 * `BLOB_READ_WRITE_TOKEN`이 자동으로 들어온다.
 */

export const dynamic = "force-dynamic";

const INDEX = "wall/index.json";

export interface HoldEntry {
  id: number;
  name: string;
  note: string;
  hold: string;
  url: string;
}

/** index.json을 읽는다. 아직 없으면 빈 벽이다. */
async function readIndex(): Promise<HoldEntry[]> {
  const found = await list({ prefix: INDEX, limit: 1 });
  const blob = found.blobs.find((b) => b.pathname === INDEX);
  if (!blob) return [];
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as HoldEntry[];
}

export async function GET() {
  try {
    return Response.json({ holds: await readIndex() });
  } catch (err) {
    console.error("wall read failed", err);
    return Response.json({ holds: [], error: "read failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { name?: string; note?: string; hold?: string; img?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  const img = typeof body.img === "string" ? body.img : "";
  if (!img.startsWith("data:image/png;base64,")) {
    return Response.json({ error: "png data url required" }, { status: 400 });
  }

  const bytes = Buffer.from(img.slice(img.indexOf(",") + 1), "base64");
  // 한 장이 이보다 크면 굽는 쪽이 잘못된 것이다
  if (bytes.length > 2_000_000) {
    return Response.json({ error: "too large" }, { status: 413 });
  }

  const id = Date.now();

  try {
    const image = await put(`wall/${id}.png`, bytes, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
    });

    const entry: HoldEntry = {
      id,
      name: String(body.name ?? "").slice(0, 24),
      note: String(body.note ?? "").slice(0, 60),
      hold: String(body.hold ?? "").slice(0, 24),
      url: image.url,
    };

    // 전시장에서는 한 번에 한 사람이 쓰므로 읽고 다시 쓰는 것으로 충분하다
    const wall = await readIndex();
    wall.push(entry);
    await put(INDEX, JSON.stringify(wall), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });

    return Response.json({ entry });
  } catch (err) {
    console.error("wall write failed", err);
    return Response.json({ error: "write failed" }, { status: 500 });
  }
}
