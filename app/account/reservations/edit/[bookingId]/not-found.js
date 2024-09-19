import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-2xl font-semibold">
        This reservation could not be found :(
      </h1>
      <Link
        href="/account/reservations"
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-base"
      >
        Back to your reservations
      </Link>
    </main>
  );
}

export default NotFound;
