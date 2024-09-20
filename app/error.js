"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-2xl font-semibold">Something went wrong!</h1>
      <p className="text-base">{error.message}</p>

      <button
        className="inline-block bg-accent-500 text-primary-800 px-5 py-2 text-base"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
