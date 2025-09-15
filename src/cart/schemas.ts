import { z } from "zod";

export const cookieCartItemsSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
  })
);

export const cartItemsSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
    name: z.string(),
    price: z.number(),
    imageUrl: z.url(),
  })
);

export type CookieCartItems = z.infer<typeof cookieCartItemsSchema>;
export type CartItems = z.infer<typeof cartItemsSchema>;
