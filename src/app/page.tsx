const profile = {
  name: "김클로",
  bio: "세계 최강 바이브코더",
  // 사진 파일을 public/ 에 넣고 "/avatar.jpg" 처럼 적으면 사진으로 바뀝니다
  avatar: "",
};

const links = [
  { title: "인스타그램", url: "https://instagram.com" },
  { title: "유튜브", url: "https://youtube.com" },
  { title: "블로그", url: "https://blog.naver.com" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-4 px-6 py-12">
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar}
          alt={profile.name}
          className="size-32 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-32 items-center justify-center rounded-full bg-black/5 text-4xl dark:bg-white/10">
          {profile.name.slice(0, 1)}
        </div>
      )}

      <h1 className="mt-2 text-xl font-bold">{profile.name}</h1>
      <p className="text-sm text-black/60 dark:text-white/60">{profile.bio}</p>

      <ul className="mt-4 flex w-full flex-col gap-3">
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-black/15 px-4 py-4 text-center font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
