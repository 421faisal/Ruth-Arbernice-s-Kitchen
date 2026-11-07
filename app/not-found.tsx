import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gold-pattern flex min-h-[70vh] flex-1 items-center justify-center px-5 py-20 text-center">
      <div className="space-y-5">
        <p className="font-script text-6xl text-gold">Oh no!</p>
        <h1 className="font-serif text-3xl font-bold text-cream">We couldn’t find that page.</h1>
        <Link href="/" className="inline-block rounded-full bg-gold px-7 py-3 font-semibold text-ink hover:bg-gold-light">
          Back to the kitchen
        </Link>
      </div>
    </div>
  );
}
