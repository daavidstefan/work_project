"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feature {
  key: string;
  label: string;
}

export default function AddNewProject() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [featInput, setFeatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const featRef = useRef<HTMLInputElement>(null);

  const addFeature = () => {
    const label = featInput.trim();
    if (!label) return;

    if (features.some((f) => f.label.toLowerCase() === label.toLowerCase())) {
      setFeatInput("");
      featRef.current?.focus();
      return;
    }

    const key =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    setFeatures((prev) => [...prev, { key, label }]);
    setFeatInput("");
    featRef.current?.focus();
  };

  const removeFeature = (key: string) =>
    setFeatures((prev) => prev.filter((f) => f.key !== key));

  const pushToDatabase = async () => {
    if (!name.trim()) {
      toast.error("Titlul proiectului este obligatoriu");
      return;
    }
    if (details.trim().length < 50) {
      toast.error("Descrierea trebuie să aibă minim 50 de caractere");
      return;
    }

    if (features.length === 0) {
      toast.error("Trebuie să adaugi cel puțin un serviciu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          details: details.trim() || null,
          features: features.map((f) => ({ key: f.key, label: f.label })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Eroare la salvare");
      }
      toast.success("Proiect Adaugat");
      setName("");
      setDetails("");
      setFeatures([]);
      setFeatInput("");
    } catch (error: any) {
      toast.error(error.message || "A aparut o eroare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(55vw-3rem)] h-[calc(92vh-3rem)] overflow-y-auto p-6">
        <CardHeader>
          <div className="h-full flex flex-col items-center justify-center text-center gap-2">
            <CardTitle className="text-lg align-center">
              Adaugă un proiect nou
            </CardTitle>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="p-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introdu titlul proiectului..."
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="p-2">
            <Textarea
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                // auto-resize
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
              placeholder="Adaugă o descriere..."
              className="w-full rounded-md border px-3 py-2 text-sm outline-none resize-none overflow-hidden"
            />
            <div
              className={`text-sm mt-1 ${
                details.length < 50 ? "text-red-500" : "text-green-600"
              }`}
            >
              {details.length}/50 caractere
            </div>
          </div>
          <div className="p-2 flex items-center gap-2">
            <Input
              ref={featRef}
              value={featInput}
              onChange={(e) => setFeatInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
              placeholder="Adaugă un serviciu..."
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
            />
            <Button onClick={addFeature} className="shrink-0">
              Adaugă
            </Button>
          </div>
          <div className="p-2">
            <Card>
              <CardTitle className="text-center">Lista servicii</CardTitle>
              <div className="p-2">
                {/* aici apar badge-urile cu features */}
                {features.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Niciun feature adăugat încă.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {features.map((f) => (
                      <Badge
                        key={f.key}
                        variant="outline"
                        className="inline-flex items-center gap-1 text-muted-foreground pl-2 pr-1"
                      >
                        <span>{f.label}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => removeFeature(f.key)}
                                className="ml-1 rounded p-0.5 hover:bg-muted cursor-pointer"
                                aria-label={`Elimină ${f.label}`}
                              >
                                <X className="size-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Șterge</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </CardContent>
        <Separator />
        <Button onClick={pushToDatabase} disabled={loading}>
          {loading ? "Se salvează..." : "Adaugă proiectul"}
        </Button>
      </Card>
    </div>
  );
}
