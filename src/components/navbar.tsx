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
import { getCartItems } from "@/cart/actions";
import Image from "next/image";
import { Frown, ShoppingBag } from "lucide-react";
import { NavbarLinks } from "./navbar-links";
import { TooltipProvider } from "./ui/tooltip";
import { RemoveFromCart } from "./remove-from-cart";
import { QuantitySelect } from "./quantity-select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

async function Navbar() {
  const cartItems = await getCartItems();
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="border-b shadow-xs">
      <div className="max-w-7xl mx-auto p-4 py-2 flex justify-between">
        <NavbarLinks />

        <ul className="flex items-center gap-2">
          <li className="pr-2.5">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative" size="icon">
                  <ShoppingBag />
                  <span className="sr-only">Open Cart</span>
                  <Badge
                    variant="outline"
                    className="absolute -top-1.5 -right-2.5"
                    aria-label="Cart item count"
                  >
                    {cartItemCount}
                  </Badge>
                </Button>
              </SheetTrigger>

              <SheetContent autoFocusClose>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    You have {cartItemCount} items in your cart.
                  </SheetDescription>
                </SheetHeader>

                {!cartItemCount ? (
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
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 w-full border rounded-xl p-3"
                        >
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-[4.25rem] object-cover rounded-sm"
                            width={200}
                            height={200}
                          />
                          <div className="flex-1 grid grid-cols-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex justify-end">
                              <RemoveFromCart productId={item.id} />
                            </div>

                            <div className="font-medium">
                              {(item.price / 100).toFixed(2)} kr
                            </div>
                            <div className="text-sm text-muted-foreground flex justify-end items-center gap-1">
                              <label htmlFor={`quantity-trigger-${item.id}`}>
                                Qty
                              </label>
                              <QuantitySelect
                                productId={item.id}
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
                    <Button
                      asChild={!!cartItemCount}
                      disabled={!cartItemCount}
                      className="w-full"
                    >
                      {!cartItemCount ? (
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
        </ul>
      </div>
    </nav>
  );
}

export { Navbar };
