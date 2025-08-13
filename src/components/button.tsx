"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";

type NavbarButtonProps = React.ComponentProps<typeof Button>;

export function NavbarButton(props: NavbarButtonProps) {
  return <Button variant="default" size="sm" {...props} />;
}
