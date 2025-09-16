"use client";

import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import * as React from "react";

type PrintButtonProps = React.ComponentProps<typeof Button>;

export function PrintButton({ children, ...props }: PrintButtonProps) {
  return (
    <Button
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        window.print();
      }}
    >
      <Printer className="h-4 w-4" /> {children ?? "Print"}
    </Button>
  );
}
