import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-center px-4">
      <h1 className="text-2xl font-semibold text-text mb-2">Kanban</h1>
      <p className="text-muted text-sm mb-6">
        Organize your work, the simple way.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="bg-accent hover:bg-[#6872e5] text-white text-sm font-medium px-4 py-2 rounded-[7px] transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="bg-surface border border-border hover:border-[#2c2d30] text-text text-sm px-4 py-2 rounded-[7px] transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
