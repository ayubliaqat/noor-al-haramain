export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white px-4">
      <div className="w-full max-w-xl rounded-2xl border border-soft-beige bg-card p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-deep-teal">
          Noor Al Haramain
        </h1>
        <p className="mt-2 text-sm tracking-wide text-gold">
          HAJJ &amp; UMRAH BLOG
        </p>

        <p className="mt-6 text-muted-teal">
          This card is styled entirely with your brand color tokens — if
          it looks right, Tailwind is wired up correctly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-lg bg-emerald px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rich-emerald">
            Primary Button
          </button>
          <button className="rounded-lg bg-deep-teal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dark-teal">
            Deep Teal
          </button>
          <button className="rounded-lg border border-gold px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold-light hover:text-charcoal">
            Gold Outline
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-8">
          <Swatch className="bg-deep-teal" label="Deep Teal" />
          <Swatch className="bg-dark-teal" label="Dark Teal" />
          <Swatch className="bg-emerald" label="Emerald" />
          <Swatch className="bg-rich-emerald" label="Rich Emerald" />
          <Swatch className="bg-gold" label="Gold" />
          <Swatch className="bg-gold-light" label="Gold Light" />
          <Swatch className="bg-warm-white border border-soft-beige" label="Warm White" />
          <Swatch className="bg-soft-beige" label="Soft Beige" />
        </div>
      </div>
    </div>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-8 w-8 rounded-md ${className}`} />
      <span className="text-[10px] text-muted-teal">{label}</span>
    </div>
  );
}