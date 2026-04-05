export interface CategoryTheme {
  emoji: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  accentHover: string;
  gradientFrom: string;
  gradientTo: string;
}

const themes: Record<string, CategoryTheme> = {
  "骨董・アンティーク": {
    emoji: "🏺",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    accent: "bg-amber-500",
    accentHover: "hover:bg-amber-600",
    gradientFrom: "from-amber-400",
    gradientTo: "to-yellow-300",
  },
  "雑貨・衣類": {
    emoji: "👗",
    bgLight: "bg-pink-50",
    borderColor: "border-pink-200",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-700",
    accent: "bg-pink-500",
    accentHover: "hover:bg-pink-600",
    gradientFrom: "from-pink-400",
    gradientTo: "to-rose-300",
  },
  "ハンドメイド・クラフト": {
    emoji: "🎨",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    accent: "bg-purple-500",
    accentHover: "hover:bg-purple-600",
    gradientFrom: "from-purple-400",
    gradientTo: "to-violet-300",
  },
  "農産物・食品": {
    emoji: "🥦",
    bgLight: "bg-lime-50",
    borderColor: "border-lime-200",
    badgeBg: "bg-lime-100",
    badgeText: "text-lime-700",
    accent: "bg-lime-500",
    accentHover: "hover:bg-lime-600",
    gradientFrom: "from-lime-400",
    gradientTo: "to-green-300",
  },
  "オールジャンル": {
    emoji: "🛍️",
    bgLight: "bg-sky-50",
    borderColor: "border-sky-200",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    accent: "bg-sky-500",
    accentHover: "hover:bg-sky-600",
    gradientFrom: "from-sky-400",
    gradientTo: "to-cyan-300",
  },
};

const fallback: CategoryTheme = {
  emoji: "🏷️",
  bgLight: "bg-emerald-50",
  borderColor: "border-emerald-200",
  badgeBg: "bg-emerald-100",
  badgeText: "text-emerald-700",
  accent: "bg-emerald-500",
  accentHover: "hover:bg-emerald-600",
  gradientFrom: "from-emerald-400",
  gradientTo: "to-teal-300",
};

export function getCategoryTheme(category: string): CategoryTheme {
  return themes[category] ?? fallback;
}
