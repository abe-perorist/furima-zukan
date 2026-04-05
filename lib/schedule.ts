/**
 * schedule_rule フォーマット:
 *
 *   weekly:sat              毎週土曜日
 *   weekly:sun              毎週日曜日
 *
 *   monthly:1sun            毎月第1日曜日
 *   monthly:1sun,3sun       毎月第1・3日曜日
 *   monthly:3sat,3sun       毎月第3土・日曜日
 *   monthly:1sat            毎月第1土曜日
 *
 *   monthly:d21             毎月21日
 *
 *   monthly:2sun:5-10       5〜10月の第2日曜日（seasonal）
 *
 *   irregular               不定期（日付計算なし）
 */

const DOW: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const DOW_LABEL = ["日", "月", "火", "水", "木", "金", "土"];

/** 指定年月の第N曜日を返す。月をまたぐ場合は null */
function nthWeekday(year: number, month: number, nth: number, dow: number): Date | null {
  const d = new Date(year, month - 1, 1);
  while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + (nth - 1) * 7);
  if (d.getMonth() !== month - 1) return null;
  return new Date(d);
}

/** 今日から monthsAhead ヶ月後までの開催日一覧を生成 */
export function generateUpcomingDates(rule: string, monthsAhead = 6): Date[] {
  if (!rule || rule === "irregular") return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setMonth(cutoff.getMonth() + monthsAhead);

  const dates: Date[] = [];

  // weekly:sat など
  if (rule.startsWith("weekly:")) {
    const dayStr = rule.slice(7);
    const dow = DOW[dayStr];
    if (dow === undefined) return [];
    const d = new Date(today);
    while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
    while (d <= cutoff) {
      dates.push(new Date(d));
      d.setDate(d.getDate() + 7);
    }
    return dates;
  }

  // monthly:...
  if (rule.startsWith("monthly:")) {
    const rest = rule.slice(8);

    // 月制限の解析: monthly:2sun:5-10
    let monthRange: [number, number] | null = null;
    let ruleBody = rest;
    const colonIdx = rest.indexOf(":");
    if (colonIdx !== -1) {
      ruleBody = rest.slice(0, colonIdx);
      const [s, e] = rest.slice(colonIdx + 1).split("-").map(Number);
      monthRange = [s, e];
    }

    // monthly:d21 — 毎月特定日
    if (ruleBody.startsWith("d")) {
      const dayOfMonth = parseInt(ruleBody.slice(1));
      for (let m = 0; m <= monthsAhead + 1; m++) {
        const d = new Date(today.getFullYear(), today.getMonth() + m, dayOfMonth);
        if (isNaN(d.getTime()) || d < today || d > cutoff) continue;
        const mo = d.getMonth() + 1;
        if (monthRange && (mo < monthRange[0] || mo > monthRange[1])) continue;
        dates.push(d);
      }
      return dates;
    }

    // monthly:1sun,3sun など
    const patterns = ruleBody.split(",");
    for (let m = 0; m <= monthsAhead + 1; m++) {
      const absMonth = today.getMonth() + m;
      const targetYear = today.getFullYear() + Math.floor(absMonth / 12);
      const targetMonth = (absMonth % 12) + 1;
      if (monthRange && (targetMonth < monthRange[0] || targetMonth > monthRange[1])) continue;

      for (const pattern of patterns) {
        const nth = parseInt(pattern[0]);
        const dayStr = pattern.slice(1);
        const dow = DOW[dayStr];
        if (isNaN(nth) || dow === undefined) continue;
        const d = nthWeekday(targetYear, targetMonth, nth, dow);
        if (!d || d < today || d > cutoff) continue;
        dates.push(d);
      }
    }

    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates.filter((d, i) => i === 0 || d.getTime() !== dates[i - 1].getTime());
  }

  return [];
}

/** Date → "YYYY-MM-DD" */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "YYYY-MM-DD" → "4月6日（日）" */
export function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getMonth() + 1}月${d.getDate()}日（${DOW_LABEL[d.getDay()]}）`;
}

/** "YYYY-MM-DD" → "2026年4月6日（日）" */
export function formatFullDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DOW_LABEL[d.getDay()]}）`;
}

/** "YYYY-MM-DD" → "YYYY-MM"（フィルタ用） */
export function toYearMonth(iso: string): string {
  return iso.slice(0, 7);
}

/** 今後 monthsAhead ヶ月の "YYYY-MM" リストを返す */
export function getUpcomingMonths(monthsAhead = 6): string[] {
  const today = new Date();
  const months: string[] = [];
  for (let i = 0; i <= monthsAhead; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return months;
}

/** "YYYY-MM" → "2026年4月" */
export function formatYearMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${parseInt(m)}月`;
}
