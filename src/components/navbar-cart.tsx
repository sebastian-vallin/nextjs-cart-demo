import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Frown, Loader2, ShoppingBag } from "lucide-react";
import { TooltipProvider } from "./ui/tooltip";
import { RemoveFromCart } from "./remove-from-cart";
import { QuantitySelect } from "./quantity-select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { getCart, getCartCookie } from "@/cart/data";

async function NavbarCart() {
  const cartId = await getCartCookie();
  const cart = await getCart(cartId);

  return (
    <li className="pr-2.5">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="relative" size="icon">
            <ShoppingBag />
            <span className="sr-only">Open Cart</span>
            <Badge
              variant="outline"
              className="absolute -top-1.5 -right-2.5 bg-background"
              aria-label="Cart item count"
            >
              {cart?.itemCount ?? 0}
            </Badge>
          </Button>
        </SheetTrigger>

        <SheetContent autoFocusClose>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              You have {cart?.itemCount ?? 0} items in your cart.
            </SheetDescription>
          </SheetHeader>

          {!cart ? (
            <div className="px-4">
              <Alert className="text-center">
                <AlertTitle>
                  <div className="py-2">
                    <Frown className="size-9 mx-auto" />
                  </div>
                  Your cart is empty.
                </AlertTitle>
                <AlertDescription>
                  Add some products to your cart to see them here.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <TooltipProvider>
              <div className="px-4 space-y-2">
                {cart?.items.map((item) => (
                  <div
                    key={`${item.cartId}-${item.productId}`}
                    className="flex gap-4 w-full border rounded-xl p-3"
                  >
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-[4.25rem] object-cover rounded-sm"
                      width={200}
                      height={200}
                    />
                    <div className="flex-1 grid grid-cols-2">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="flex justify-end">
                        <RemoveFromCart productId={item.product.id} />
                      </div>

                      <div className="font-medium">
                        {new Intl.NumberFormat("sv-SE", {
                          style: "currency",
                          currency: "SEK",
                        }).format(item.product.price / 100)}
                      </div>
                      <div className="text-sm text-muted-foreground flex justify-end items-center gap-1">
                        <label htmlFor={`quantity-trigger-${item.productId}`}>
                          Qty
                        </label>
                        <QuantitySelect
                          productId={item.productId}
                          defaultQuantity={item.quantity}
                          maxQuantity={Math.max(item.quantity, 10)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          )}

          <SheetFooter>
            <SheetClose asChild>
              <Button asChild={!!cart} disabled={!cart} className="w-full">
                {!cart ? (
                  <>
                    <ShoppingBag strokeWidth={2.5} />
                    Go to checkout
                  </>
                ) : (
                  <Link href="/checkout">
                    <ShoppingBag strokeWidth={2.5} />
                    Go to checkout
                  </Link>
                )}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </li>
  );
}

function NavbarCartPlaceholder() {
  return (
    <li className="pr-2.5">
      <Button variant="ghost" className="relative" size="icon" disabled>
        <ShoppingBag />
        <span className="sr-only">Open Cart</span>
        <Badge
          variant="outline"
          className="absolute -top-1.5 -right-2.5 px-0.5 bg-background"
          aria-label="Cart item count"
        >
          <Loader2 className="animate-spin" />
        </Badge>
      </Button>
    </li>
  );
}

export { NavbarCart, NavbarCartPlaceholder };
