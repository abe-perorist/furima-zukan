type Color = "green" | "blue" | "orange" | "purple";

const colorMap: Record<Color, string> = {
  green: "bg-green-50 border-green-200 text-green-800",
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  orange: "bg-orange-50 border-orange-200 text-orange-800",
  purple: "bg-purple-50 border-purple-200 text-purple-800",
};

export default function StatChip({
  icon,
  label,
  count,
  color,
}: {
  icon: string;
  label: string;
  count: number;
  color: Color;
}) {
  return (
    <div className={`rounded-2xl border-2 p-3 text-center ${colorMap[color]}`}>
      <div className="text-2xl mb-0.5">{icon}</div>
      <div className="text-lg font-bold">{count}件</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}
