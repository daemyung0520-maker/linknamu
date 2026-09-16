const profile = {
  name: "김개발",
  bio: "풀 스택 개발자, 요즘에는 AI 개발에 관심이 많아요",
  // 사진 파일을 public/ 에 넣고 "/avatar.jpg" 처럼 적으면 사진이 바뀝니다
  avatar: "/avatar.svg",
};

const links = [
  { title: "인스타그램", url: "https://instagram.com" },
  { title: "유튜브", url: "https://youtube.com" },
  { title: "블로그", url: "https://blog.naver.com" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col items-center px-7 pb-20 pt-20">
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar}
          alt={profile.name}
          className="avatar size-28 rounded-full object-cover"
        />
      ) : (
        <div className="avatar flex size-28 items-center justify-center rounded-full bg-white/60 text-4xl">
          {profile.name.slice(0, 1)}
        </div>
      )}

      <h1 className="mt-7 text-[1.625rem] font-bold tracking-[-0.02em]">
        {profile.name}
      </h1>
      <p className="mt-2.5 text-center text-[0.9375rem] leading-relaxed text-ink-soft">
        {profile.bio}
      </p>

      <ul className="mt-11 flex w-full flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card px-5 py-4 text-center text-base font-semibold"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
