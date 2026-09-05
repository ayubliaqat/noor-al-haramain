type StatCardProps = {
  label: string;
  value: number | string;
  color: "emerald" | "gold" | "deep-teal";
};

const COLOR_MAP = {
  emerald: "bg-emerald",
  gold: "bg-gold",
  "deep-teal": "bg-deep-teal",
};

export default function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-5 py-4 text-white ${COLOR_MAP[color]}`}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}