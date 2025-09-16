import { getCart } from "@/cart/data";
import { CheckoutCart } from "./checkout-cart";
import { CheckoutForm } from "./checkout-form";
import { CART_COOKIE_NAME } from "@/cart/constants";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME);
  const cart = await getCart(cartId?.value);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <CheckoutCart />
        </div>
        <div className="flex-1">
          <CheckoutForm disabled={!cart} />
        </div>
      </div>
    </div>
  );
}
