"use client";

import { TableButton } from "./table-button";

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
};

export default function TestTable({ projects }: { projects: Project[] }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Table className="table-fixed w-full">
        <TableCaption>
          Lista proiectelor disponibile.{" "}
          <span
            style={{
              color: "black",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => console.log("Adaugare proiect nou")}
          >
            Adaugă un proiect nou
          </span>
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 text-left">ID</TableHead>
            <TableHead className="w-1/3 text-center">Proiect</TableHead>
            <TableHead className="w-1/3 text-right">Detalii</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="w-1/3 text-left">{p.id}</TableCell>
              <TableCell className="w-1/3 text-center">{p.name}</TableCell>
              <TableCell className="w-1/3 text-right">
                <div className="flex justify-end">
                  <TableButton slug={p.slug}></TableButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
