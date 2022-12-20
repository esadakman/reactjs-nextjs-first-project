import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Next JS pre-rendering</h1>
      <Link href="/users">
        <h3>Users</h3>
      </Link>
      <Link href="/posts">
        <h3>Posts</h3>
      </Link>
    </>
  );
}
