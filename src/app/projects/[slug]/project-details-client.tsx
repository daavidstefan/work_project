// primeste props de la \prokects\[slug]\page.tsx
// afiseaza datele despre proiect in ui

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

type Feature = { id: number; key: string; label: string };
export default function ProjectDetailsClient({
  project,
  features,
}: {
  project: { name: string; details: string };
  features: Feature[];
}) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number, checked: boolean) =>
    setSelected(
      (prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)) // daca checked e true, adauga id in lista
    );

  const unselect = (id: number) =>
    setSelected((prev) => prev.filter((x) => x !== id));

  const selectedFeatures = features.filter((f) => selected.includes(f.id));

  return (
    <div className="grid gap-6 lg:grid-cols-3 p-6">
      {/* titlu + descriere */}
      <Card className="lg:col-span-1 h-[calc(93vh-3rem)] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center text-lg">{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {project.details}
        </CardContent>
      </Card>

      {/* lista features + sectiunea de generate key */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* lista features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Servicii</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="mx-auto w-[95%] rounded-md border">
              <div className="max-h-[38vh] overflow-auto">
                <Table
                  className="
    w-full table-fixed
    [&_th]:align-middle [&_td]:align-middle
    [&_th]:px-8 [&_td]:px-8         /* padding egal stânga/dreapta */
    [&_th:first-child]:pl-6 [&_td:first-child]:pl-6
    [&_th:last-child]:pr-6  [&_td:last-child]:pr-6
    [&_th:last-child]:text-right [&_td:last-child]:text-right
  "
                >
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>

                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-1/2">Denumire</TableHead>
                      <TableHead className="w-1/2">Alege</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {features.map((f) => {
                      const checked = selected.includes(f.id);
                      return (
                        <TableRow
                          key={f.id}
                          data-state={checked ? "selected" : undefined}
                          className="cursor-pointer hover:bg-accent/40 data-[state=selected]:bg-accent/60 transition-colors"
                          onClick={() => {
                            toggle(f.id, !checked);
                          }}
                        >
                          <TableCell className="w-1/2">
                            <div className="font-medium">{f.label}</div>
                            {/* <div className="text-xs text-muted-foreground">
                              {f.key}
                            </div> */}
                          </TableCell>

                          <TableCell className="w-1/2 text-right">
                            <span
                              className="inline-flex"
                              onClick={(e) => e.stopPropagation()} // ca sa nu existe 2 toggle-uri
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) =>
                                  toggle(f.id, Boolean(v))
                                }
                                //onClickCapture={(e) => e.stopPropagation()}
                                aria-label={`Select ${f.label}`}
                              />
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* sectiunea de generate key */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Obține cheia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Servicii alese:
              </div>

              <div className="rounded-md border p-3 min-h-16">
                {selectedFeatures.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    — niciunul —
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((f) => (
                      <Badge
                        key={f.id}
                        variant="outline"
                        className="inline-flex items-center gap-1 text-muted-foreground pl-2 pr-1"
                      >
                        <span>{f.label}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => unselect(f.id)}
                                className="ml-1 rounded p-0.5 hover:bg-muted cursor-pointer"
                                aria-label={`Elimină ${f.label}`}
                              >
                                <X className="size-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Elimină</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <Button
                variant="destructive"
                className="h-11 cursor-pointer"
                disabled={selectedFeatures.length === 0}
                onClick={() => toast.error("Zonă în construcție...")}
              >
                Generează licența!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
