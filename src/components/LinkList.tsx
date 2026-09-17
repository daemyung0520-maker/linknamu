"use client";

import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/links";

const zeros = Object.fromEntries(links.map((l) => [l.url, 0]));

export default function LinkList() {
  // 서버에서 받기 전에는 전부 0회로 보여준다.
  const [counts, setCounts] = useState<Record<string, number>>(zeros);
  // 이미 눌러서 내 화면에서 1 올려둔 링크. 늦게 도착한 조회 결과가 이걸 되돌리지 않게 한다.
  const clicked = useRef(new Set<string>());

  useEffect(() => {
    fetch("/api/clicks", { cache: "no-store" })
      .then((res) => res.json())
      .then((fresh: Record<string, number>) =>
        setCounts((prev) =>
          Object.fromEntries(
            Object.keys(prev).map((url) => [
              url,
              clicked.current.has(url) ? prev[url] : (fresh[url] ?? 0),
            ]),
          ),
        ),
      )
      .catch(() => {}); // 못 불러와도 0회가 그대로 보이면 된다
  }, []);

  function handleClick(url: string) {
    clicked.current.add(url);
    setCounts((prev) => ({ ...prev, [url]: prev[url] + 1 })); // 눌리자마자 바로 반영
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count: number } | null) => {
        if (data) setCounts((prev) => ({ ...prev, [url]: data.count }));
      })
      .catch(() => {}); // 저장에 실패해도 화면은 그대로 둔다
  }

  return (
    <ul className="mt-11 flex w-full flex-col gap-3.5">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(link.url)}
            className="link-card relative px-5 py-4 text-center text-base font-semibold"
          >
            {link.title}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-soft tabular-nums">
              {counts[link.url]}회
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
