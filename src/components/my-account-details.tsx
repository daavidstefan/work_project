"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, Mail, IdCard } from "lucide-react";

type AccountDetails = {
  id: number;
  email: string;
  username: string;
  name: string;
  created_at: string;
};

export default function MyAccountDetailsCard({
  details,
}: {
  details: AccountDetails[];
}) {
  const user = details[0];

  return (
    <div className="p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(65vw-3rem)] h-[calc(92vh-3rem)] overflow-y-auto p-6 flex flex-col">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-lg">
            Salut,{" "}
            <span className="text-primary font-semibold">{user.name}!</span>
          </CardTitle>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent className="flex flex-col gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2">
                <IdCard className="w-4 h-4 text-primary" />
                ID-ul contului
              </Label>
              <Input value={user.id} disabled />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nume utilizator
              </Label>
              <Input value={user.username} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nume complet
              </Label>
              <Input value={user.name} disabled />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input value={user.email} disabled />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Data creării contului
            </Label>
            <Input
              value={new Date(user.created_at).toLocaleDateString("ro-RO")}
              disabled
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center text-sm text-muted-foreground justify-center gap-3">
          <p>Detaliile contului tău.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
