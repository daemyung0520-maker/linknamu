// 클릭수 저장 로직 점검: node --env-file=.env.local scripts/check-clicks.mjs
// 진짜 링크는 건드리지 않고 임시 열쇠로 넣었다 지운다.
import assert from "node:assert/strict";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const key = `__check__${Date.now()}`;

try {
  const clicks = (await client.connect()).db().collection("clicks");
  const bump = () =>
    clicks.findOneAndUpdate(
      { _id: key },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" },
    );

  assert.equal((await bump()).count, 1, "없던 링크는 1부터 시작해야 한다");
  assert.equal((await bump()).count, 2, "누를 때마다 1씩 늘어야 한다");

  const found = await clicks.find({ _id: { $in: [key] } }).toArray();
  assert.equal(found[0].count, 2, "조회한 값이 저장된 값과 같아야 한다");

  await clicks.deleteOne({ _id: key });
  console.log("OK: increment + read back");
} finally {
  await client.close();
}
