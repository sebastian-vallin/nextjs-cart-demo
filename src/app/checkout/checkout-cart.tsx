import { CART_COOKIE_NAME } from "@/cart/constants";
import { getCart } from "@/cart/data";
import { QuantitySelect } from "@/components/quantity-select";
import { RemoveFromCart } from "@/components/remove-from-cart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Frown } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

const shipping = 4900;

export async function CheckoutCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME);
  const cart = await getCart(cartId?.value);
  const orderTotal = (cart?.totalPrice ?? 0) + shipping;

  return (
    <div className="space-y-6">
      <TooltipProvider>
        <div className="space-y-6 rounded-xl border p-4">
          <h2 className="font-bold text-xl">Cart</h2>

          {!cart ? (
            <Alert className="text-center">
              <AlertTitle>
                <div className="py-2">
                  <Frown className="size-9 mx-auto" />
                </div>
                Your cart is empty.
              </AlertTitle>
              <AlertDescription className="justify-center">
                Add some products to your cart to see them here.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="divide-y *:not-last:pb-4 *:not-first:pt-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4 w-full">
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
                      <RemoveFromCart productId={item.productId} />
                    </div>

                    <div className="font-medium">
                      {(item.product.price / 100).toFixed(2)} kr
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
          )}
        </div>
      </TooltipProvider>

      <div className="space-y-6 rounded-xl border p-4">
        <h2 className="font-bold text-xl">Order summary</h2>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div>{(!cart ? 0 : cart.totalPrice / 100).toFixed(2)} kr</div>
          </div>
          <div className="flex justify-between">
            <div>Shipping</div>
            <div>{(shipping / 100).toFixed(2)} kr</div>
          </div>
          <div className="flex justify-between">
            <div>Total</div>
            <div>{(orderTotal / 100).toFixed(2)} kr</div>
          </div>
        </div>
      </div>
    </div>
  );
}
