import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">What does this bill do?</h1>
      <p className="mt-2 text-gray-600">
        A simple legislative tracking prototype.
      </p>

      <Link
        href="/bills"
        className="inline-block mt-6 rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90"
      >
        View Bills
      </Link>
    </main>
  );
}
