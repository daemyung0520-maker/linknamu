import { MongoClient } from "mongodb";
import { links } from "@/lib/links";

type ClickDoc = { _id: string; count: number };

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI 환경 변수가 없습니다 (.env.local 을 확인하세요)");

// 개발 중 파일을 고칠 때마다 접속이 새로 생기지 않도록 전역에 한 번만 만들어 재사용한다.
const globalForMongo = globalThis as typeof globalThis & {
  _mongo?: Promise<MongoClient>;
};
const clientPromise = (globalForMongo._mongo ??= new MongoClient(uri).connect());

async function clicks() {
  const client = await clientPromise;
  return client.db().collection<ClickDoc>("clicks");
}

const knownUrls = new Set(links.map((l) => l.url));

// 모든 링크의 현재 클릭수를 한 번에 돌려준다. { "https://...": 24, ... }
export async function GET() {
  const docs = await (await clicks())
    .find({ _id: { $in: [...knownUrls] } })
    .toArray();

  const counts = Object.fromEntries([...knownUrls].map((url) => [url, 0]));
  for (const doc of docs) counts[doc._id] = doc.count;

  return Response.json(counts);
}

// 링크 하나의 클릭수를 1 올리고, 올린 뒤의 값을 돌려준다.
export async function POST(request: Request) {
  const { url } = (await request.json()) as { url?: string };

  // 목록에 없는 주소는 거부한다 (아무 값이나 저장되는 것을 막는다)
  if (!url || !knownUrls.has(url)) {
    return Response.json({ error: "알 수 없는 링크입니다" }, { status: 400 });
  }

  const doc = await (await clicks()).findOneAndUpdate(
    { _id: url },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: "after" },
  );

  return Response.json({ count: doc?.count ?? 1 });
}
