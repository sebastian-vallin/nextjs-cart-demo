"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { toast } from "sonner";
import { removeFromCart } from "@/cart/actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

function RemoveFromCart({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isRemoving, setIsRemoving] = React.useState(false);

  function remove() {
    setIsRemoving(true);
    toast.promise(removeFromCart(productId), {
      position: "top-center",
      loading: "Removing from cart...",
      success: "Product removed from cart!",
      error: "Failed to remove product from cart.",
      finally: () => setIsRemoving(false),
    });
  }

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button
          onClick={remove}
          disabled={isRemoving}
          variant={isRemoving ? "destructive" : "ghost"}
          size="icon"
          className={cn(
            "size-6",
            !isRemoving &&
              "hover:bg-destructive hover:text-white hover:shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/60"
          )}
        >
          <span className="sr-only">Remove {productName} from cart</span>
          {isRemoving ? (
            <Loader2 className="size-3.5 animate-spin" strokeWidth={2.5} />
          ) : (
            <X className="size-3.5" strokeWidth={2.5} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Remove from cart</TooltipContent>
    </Tooltip>
  );
}

export { RemoveFromCart };
