"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateParams } from "@/hooks/useUpdateParams";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TableButton } from "./table-button";

import {
  ArrowUp10,
  ArrowDown10,
  ArrowUpZA,
  ArrowDownZA,
  ClockArrowUp,
  ClockArrowDown,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Project = {
  id: number;
  name: string;
  details: string;
  slug: string;
  created_at: string | Date | null;
};

const fmtDate = (v: string | Date | null) => {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? "-" : d.toLocaleString();
};

const tipText = (
  key: "id" | "name" | "created_at",
  sort: string,
  order: string
) => {
  if (key === "id")
    return sort === "id"
      ? order === "asc"
        ? "ID crescător"
        : "ID descrescător"
      : "Sortează după ID";
  if (key === "name")
    return sort === "name"
      ? order === "asc"
        ? "Nume A→Z"
        : "Nume Z→A"
      : "Sortează după nume";
  return sort === "created_at"
    ? order === "asc"
      ? "Cele mai vechi"
      : "Cele mai recente"
    : "Sortează după dată";
};

const IconWithTip = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex cursor-pointer">{children}</span>
    </TooltipTrigger>
    <TooltipContent side="top">{text}</TooltipContent>
  </Tooltip>
);

export default function TestTable({ projects }: { projects: Project[] }) {
  const sp = useSearchParams();
  const update = useUpdateParams();

  const sort = (sp.get("sort") as "id" | "name" | "created_at") ?? "id";
  const order = (sp.get("order") as "asc" | "desc") ?? "asc";
  const q = sp.get("q") ?? "";

  const [localQ, setLocalQ] = useState(q);
  const hasFilters = Boolean(sp.get("q") || sp.get("sort") || sp.get("order"));

  const previewUrl = useMemo(() => {
    const next = new URLSearchParams(sp);
    localQ ? next.set("q", localQ) : next.delete("q");
    return `${
      typeof window !== "undefined" ? window.location.pathname : ""
    }?${next.toString()}`;
  }, [sp, localQ]);

  const toggleSort = (key: "id" | "name" | "created_at") => {
    const nextOrder = sort === key && order === "asc" ? "desc" : "asc";
    update({ sort: key, order: nextOrder }, "push");
  };

  const iconFor = (key: "id" | "name" | "created_at") => {
    const active = sort === key;
    const asc = order === "asc";
    if (key === "id")
      return active ? (
        asc ? (
          <ArrowUp10 className="size-4" />
        ) : (
          <ArrowDown10 className="size-4" />
        )
      ) : (
        <ArrowUp10 className="size-4 opacity-30" />
      );
    if (key === "name")
      return active ? (
        asc ? (
          <ArrowUpZA className="size-4" />
        ) : (
          <ArrowDownZA className="size-4" />
        )
      ) : (
        <ArrowUpZA className="size-4 opacity-30" />
      );
    return active ? (
      asc ? (
        <ClockArrowUp className="size-4" />
      ) : (
        <ClockArrowDown className="size-4" />
      )
    ) : (
      <ClockArrowUp className="size-4 opacity-30" />
    );
  };

  const btn =
    "inline-flex items-center justify-center rounded-md border px-3 text-sm h-10";

  return (
    <div className="grid gap-6 lg:grid-cols-3 p-6 ">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(55vw-3rem)] h-[calc(92vh-3rem)] overflow-y-auto p-6">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg">
              Lista proiectelor disponibile:
            </CardTitle>
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                placeholder="Caută după nume…"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                onKeyDown={(e) =>
                  e.key === "Enter" && update({ q: localQ || null }, "push")
                }
              />
              <button
                onClick={() => update({ q: localQ || null }, "push")}
                className={
                  "inline-flex items-center justify-center rounded-md border px-3 text-sm h-10 cursor-pointer"
                }
              >
                Căutare
              </button>
              <button
                disabled={!hasFilters}
                onClick={() => {
                  setLocalQ("");
                  update({ q: null, sort: null, order: null }, "push");
                }}
                className={
                  "inline-flex items-center justify-center rounded-md border px-3 text-sm h-10 whitespace-nowrap disabled:opacity-50 cursor-pointer"
                }
              >
                Șterge filtrele
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <TooltipProvider delayDuration={200}>
            <Table className="table-fixed w-full">
              <TableCaption>
                Lista proiectelor disponibile.{" "}
                <span className="underline cursor-pointer">
                  Adaugă un proiect nou
                </span>
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-left">
                    <button
                      onClick={() => toggleSort("id")}
                      className="inline-flex items-center gap-1"
                    >
                      ID
                      <IconWithTip text={tipText("id", sort, order)}>
                        {iconFor("id")}
                      </IconWithTip>
                    </button>
                  </TableHead>

                  <TableHead className="text-left">
                    <button
                      onClick={() => toggleSort("name")}
                      className="inline-flex items-center gap-1"
                    >
                      Proiect
                      <IconWithTip text={tipText("name", sort, order)}>
                        {iconFor("name")}
                      </IconWithTip>
                    </button>
                  </TableHead>

                  <TableHead className="w-[220px] text-left">
                    <button
                      onClick={() => toggleSort("created_at")}
                      className="inline-flex items-center gap-1"
                    >
                      Creat
                      <IconWithTip text={tipText("created_at", sort, order)}>
                        {iconFor("created_at")}
                      </IconWithTip>
                    </button>
                  </TableHead>

                  <TableHead className="w-[120px] text-right">
                    Detalii
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-left">{p.id}</TableCell>
                    <TableCell className="text-left">{p.name}</TableCell>
                    <TableCell className="text-left">
                      {fmtDate(p.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <TableButton slug={p.slug} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {projects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Niciun rezultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
