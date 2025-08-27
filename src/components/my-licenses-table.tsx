// tabel pentru proiectele mele

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@radix-ui/react-separator";

type Project = {
  id: number;
  name: string;
  created_at: string;
  slug: string;
};

export default function MyLicensesTable({ projects }: { projects: Project[] }) {
  const hasData = projects && projects.length > 0;
  const router = useRouter();

  // dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [target, setTarget] = useState<{ slug: string; name: string } | null>(
    null
  );

  const openDelete = (slug: string, name: string) => {
    setTarget({ slug, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!target?.slug) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/projects/${target.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Proiect șters");
      router.refresh();
    } catch {
      toast.error("Nu am putut șterge proiectul");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setTarget(null);
    }
  };

  return (
    <div className="p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(65vw-3rem)] h-[calc(92vh-3rem)] overflow-y-auto p-6 flex flex-col">
        <CardHeader>
          <div className="h-full flex flex-col items-center justify-center text-center gap-2">
            <CardTitle className="text-lg">Licențele mele</CardTitle>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1">
          <h1 className="text-center py-60">Work in progress...</h1>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground justify-center">
          Lista licențelor tale.
        </CardFooter>
      </Card>
    </div>
  );
}
