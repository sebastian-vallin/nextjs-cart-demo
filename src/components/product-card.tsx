"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { addToCart } from "@/cart/actions";
import { toast } from "sonner";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: {
      amount: number;
    };
  };
};

function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = React.useState(false);

  async function add() {
    setIsAdding(true);
    toast.promise(addToCart(product.id), {
      position: "top-center",
      loading: "Adding to cart...",
      success: "Product added to cart!",
      error: "Failed to add product to cart.",
      finally: () => setIsAdding(false),
    });
  }

  return (
    <Card key={product.id} className="overflow-hidden w-full max-w-72">
      <div className="-mt-6 bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-64 object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>
          <h2>{product.name}</h2>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>
          <p className="line-clamp-2">{product.description}</p>
        </CardDescription>
      </CardContent>

      <CardFooter className="mt-auto block space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xl font-bold">
            {new Intl.NumberFormat("sv-SE", {
              style: "currency",
              currency: "SEK",
            }).format(product.price.amount / 100)}
          </span>
          <Badge variant="outline">In Stock</Badge>
        </div>
        <Button
          onClick={add}
          disabled={isAdding}
          className="w-full font-semibold"
          variant="secondary"
          size="lg"
        >
          {isAdding ? (
            <Loader2 strokeWidth={2.5} className="animate-spin" />
          ) : (
            <ShoppingBag strokeWidth={2.5} />
          )}
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
