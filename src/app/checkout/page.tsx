import { getCartItems } from "@/cart/actions";
import { CheckoutCart } from "./checkout-cart";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const cartItems = await getCartItems();
  const hasItems = cartItems.length > 0;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <CheckoutCart />
        </div>
        <div className="flex-1">
          <CheckoutForm disabled={!hasItems} />
        </div>
      </div>
    </div>
  );
}
