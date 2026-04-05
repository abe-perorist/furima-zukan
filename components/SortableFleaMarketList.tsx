"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FleaMarketCard from "./FleaMarketCard";
import type { FleaMarket } from "@/lib/data";

interface Props {
  markets: FleaMarket[];
}

function SortableFleaMarketListInner({ markets }: Props) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "";

  const sorted = useMemo(() => {
    const arr = [...markets];
    if (sort === "free") {
      return arr.sort((a, b) => (a.is_free_entry === b.is_free_entry ? 0 : a.is_free_entry ? -1 : 1));
    }
    return arr;
  }, [markets, sort]);

  return (
    <>
      <p className="text-sm font-bold text-emerald-700 mb-4">🏷️ {sorted.length}件</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((market) => (
          <FleaMarketCard key={market.slug} market={market} />
        ))}
      </div>
    </>
  );
}

export default function SortableFleaMarketList(props: Props) {
  return (
    <Suspense fallback={
      <div className="text-sm font-bold text-emerald-700 mb-4">🏷️ {props.markets.length}件</div>
    }>
      <SortableFleaMarketListInner {...props} />
    </Suspense>
  );
}
