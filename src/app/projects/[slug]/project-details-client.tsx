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
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );

  const selectedFeatures = features.filter((f) => selected.includes(f.id));

  return (
    <div className="grid gap-6 lg:grid-cols-3 p-6">
      {/* LEFT: Project card */}
      <Card className="lg:col-span-1 h-[calc(92vh-3rem)] overflow-y-auto">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {project.details}
        </CardContent>
      </Card>

      {/* RIGHT: Features table + Generate key */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            {/* wrapper mai îngust + outline */}
            <div className="mx-auto w-[95%] rounded-md border">
              {/* scroll dacă depășește 50% din viewport */}
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
                  {/* optional, dar ok de păstrat */}
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>

                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-1/2">Feature</TableHead>
                      <TableHead className="w-1/2">Select</TableHead>
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
                          onClick={() => toggle(f.id, !checked)} // click pe tot rândul
                        >
                          <TableCell className="w-1/2">
                            <div className="font-medium">{f.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {f.key}
                            </div>
                          </TableCell>

                          {/* important: wrapper-ul NU trebuie să fie block/w-full */}
                          <TableCell className="w-1/2 text-right">
                            <span
                              className="inline-flex" // <-- cât checkbox-ul, nu acoperă celula
                              onClick={(e) => e.stopPropagation()} // oprește doar click-ul pe checkbox
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) =>
                                  toggle(f.id, Boolean(v))
                                }
                                onClickCapture={(e) => e.stopPropagation()} // alternativ sigur
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

        {/* Generate key */}
        <Card>
          <CardHeader>
            <CardTitle>Generate key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Selected features:
              </div>

              <div className="rounded-md border p-3 min-h-16">
                {selectedFeatures.length === 0 ? (
                  <div className="text-sm text-muted-foreground">— none —</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((f) => (
                      <Badge
                        key={f.id}
                        variant="outline"
                        className="text-muted-foreground"
                        title={f.key}
                      >
                        {f.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <Button
                variant="destructive"
                className="h-11"
                disabled={selectedFeatures.length === 0}
                onClick={() =>
                  console.log("Generate key for:", selectedFeatures)
                }
              >
                Generate key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
