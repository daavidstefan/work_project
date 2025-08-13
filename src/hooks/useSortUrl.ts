// app/src/hooks/useSortUrl.ts
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SortKey = "id" | "name" | "created_at";
export type SortOrder = "asc" | "desc";

export function useSortUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (key: SortKey) => {
    const currKey = (searchParams.get("sort") as SortKey) ?? "id";
    const currOrder = (searchParams.get("order") as SortOrder) ?? "asc";
    const nextOrder: SortOrder =
      currKey === key && currOrder === "asc" ? "desc" : "asc";

    const sp = new URLSearchParams(searchParams);
    sp.set("sort", key);
    sp.set("order", nextOrder);

    router.push(`${pathname}?${sp.toString()}`);
  };
}
