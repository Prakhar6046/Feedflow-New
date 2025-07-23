import Link from 'next/link';

function NotFound() {
  return (
    <main className="">
      <h1 className="">This page could not be found :(</h1>
      <Link href="/" className="">
        Go back home
      </Link>
    </main>
  );
}

export default NotFound;
