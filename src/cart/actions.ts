"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { cache } from "react";
import { CartItems, CookieCartItems, cookieCartItemsSchema } from "./schemas";
import { revalidatePath } from "next/cache";

const CART_COOKIE_NAME = "cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function emptyCart(): CookieCartItems {
  return [];
}

function getCookieCartItems(cookieValue: string) {
  let cookieCart: CookieCartItems;
  try {
    cookieCart = cookieCartItemsSchema.parse(JSON.parse(cookieValue));
  } catch {
    cookieCart = emptyCart();
  }

  return cookieCart;
}

function setCartCookie(cartItems: CartItems, cookieStore: CookieStore) {
  const cookieCartItem: CookieCartItems = cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));
  const cookieValue = JSON.stringify(cookieCartItem);

  cookieStore.set(CART_COOKIE_NAME, cookieValue, {
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export const getCartItems = cache(async (): Promise<CartItems> => {
  const cookieStore = await cookies();
  const cartItemsCookie = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cookieCart = cartItemsCookie
    ? getCookieCartItems(cartItemsCookie)
    : emptyCart();

  const products = await prisma.product.findMany({
    where: {
      id: { in: cookieCart.map((item) => item.id) },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      price: {
        select: { amount: true },
      },
    },
  });

  const cartItems = cookieCart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return null;
      }

      return {
        id: item.id,
        quantity: item.quantity,
        name: product.name,
        price: product.price.amount,
        imageUrl: product.imageUrl,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  try {
    setCartCookie(cartItems, cookieStore);
  } catch {
    // Ignore if setting the cookie in a server component
    // https://nextjs.org/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-components
  }

  return cartItems;
});

export async function addToCart(productId: string): Promise<CartItems> {
  const cookieStore = await cookies();
  const cartItems = await getCartItems();
  const existingItem = cartItems.find((item) => item.id === productId);

  let newCartItems: CartItems;
  if (existingItem) {
    newCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        price: {
          select: { amount: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    newCartItems = [
      ...cartItems,
      {
        id: product.id,
        quantity: 1,
        name: product.name,
        price: product.price.amount,
        imageUrl: product.imageUrl,
      },
    ];
  }

  setCartCookie(newCartItems, cookieStore);

  revalidatePath("/", "layout");
  return newCartItems;
}

export async function removeFromCart(productId: string): Promise<CartItems> {
  const cookieStore = await cookies();
  const cartItems = await getCartItems();
  const existingItem = cartItems.find((item) => item.id === productId);

  let newCartItems: CartItems;
  if (existingItem) {
    newCartItems = [...cartItems.filter((item) => item.id !== productId)];
  } else {
    return cartItems;
  }

  setCartCookie(newCartItems, cookieStore);

  revalidatePath("/", "layout");
  return newCartItems;
}

export async function updateCartQuantity(
  productId: string,
  quantity: number
): Promise<CartItems> {
  if (quantity < 1) {
    return await removeFromCart(productId);
  }

  const cookieStore = await cookies();
  const cartItems = await getCartItems();
  const existingItem = cartItems.find((item) => item.id === productId);

  let newCartItems: CartItems;
  if (existingItem) {
    newCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        price: {
          select: { amount: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    newCartItems = [
      ...cartItems,
      {
        id: product.id,
        quantity,
        name: product.name,
        price: product.price.amount,
        imageUrl: product.imageUrl,
      },
    ];
  }

  setCartCookie(newCartItems, cookieStore);

  revalidatePath("/", "layout");
  return newCartItems;
}
