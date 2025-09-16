import { prisma } from "@/lib/prisma";
import { OrdersTable } from "./order-table";

async function getOrders() {
  return await prisma.order.findMany({
    select: {
      id: true,
      status: true,
      customerInfo: {
        select: { email: true },
      },
      orderItems: {
        include: { price: { select: { amount: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type OrderData = Awaited<ReturnType<typeof getOrders>>[number];

export default async function OrderPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Orders</h1>

      <OrdersTable data={orders} />
    </div>
  );
}
