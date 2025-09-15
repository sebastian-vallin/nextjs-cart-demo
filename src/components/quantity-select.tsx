"use client";

import React from "react";
import { toast } from "sonner";
import { updateCartQuantity } from "@/cart/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function QuantitySelect({
  productId,
  defaultQuantity,
  maxQuantity = 20,
}: {
  productId: string;
  defaultQuantity: number;
  maxQuantity?: number;
}) {
  const [quantity, setQuantity] = React.useState(defaultQuantity);
  const [isUpdating, setIsUpdating] = React.useState(false);

  function update(value: number) {
    setIsUpdating(true);
    toast.promise(updateCartQuantity(productId, value), {
      position: "top-center",
      loading: "Updating quantity...",
      success: "Quantity updated!",
      error: "Failed update quantity.",
      finally: () => setIsUpdating(false),
    });
  }

  return (
    <Select
      value={quantity.toString()}
      onValueChange={(value) => {
        if (isUpdating) return;
        setQuantity(Number(value));
        update(Number(value));
      }}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="p-0 px-1.5 !h-6 rounded-[0.25rem] w-[3.5rem]"
        id={`quantity-trigger-${productId}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="min-w-0 rounded-[0.25rem] max-h-48"
        side="bottom"
        align="end"
      >
        {new Array(maxQuantity).fill(null).map((_, i) => (
          <SelectItem
            key={i}
            value={(i + 1).toString()}
            className="py-0.5 rounded-[0.25rem]"
          >
            {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { QuantitySelect };
