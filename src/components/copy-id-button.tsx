"use client";

import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import * as React from "react";

export function CopyIdButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
