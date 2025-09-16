import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { CopyIdButton } from "@/components/copy-id-button";

export default async function OrderPage(props: PageProps<"/orders/[orderId]">) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      customerInfo: true,
      orderItems: {
        include: { product: true, price: true },
      },
    },
  });

  if (!order) {
    return notFound();
  }

  const currency = new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  });

  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + item.price.amount * item.quantity,
    0
  );

  // Shipping fee in minor units (öre). Adjust as needed.
  const SHIPPING_FEE = 4900; // 49.00 SEK (if you intend 49.99, use 4999)
  const total = subtotal + SHIPPING_FEE;

  // Pretty country/language display from short codes like "sv", "en", "es"
  const countryCode = (order.customerInfo.country || "").trim();
  let countryLabel = countryCode.toUpperCase();
  try {
    // Try to interpret as region first (e.g., SE), fallback to language (e.g., sv)
    const dnRegion = new Intl.DisplayNames("en", { type: "region" });
    const dnLang = new Intl.DisplayNames("en", { type: "language" });
    const asRegion = countryCode
      ? dnRegion.of(countryCode.toUpperCase())
      : undefined;
    const asLang = countryCode
      ? dnLang.of(countryCode.toLowerCase())
      : undefined;
    countryLabel = (asRegion || asLang || countryLabel) as string;
  } catch {
    // Environments without Intl.DisplayNames will just show the code uppercased
  }

  const statusMeta: Record<
    typeof order.status,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    PENDING: {
      label: "Pending",
      icon: <Clock className="h-4 w-4" />,
      className:
        "border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:bg-amber-950/30",
    },
    PAID: {
      label: "Paid",
      icon: <CheckCircle2 className="h-4 w-4" />,
      className:
        "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:bg-emerald-950/30",
    },
    COMPLETED: {
      label: "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      className:
        "border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900/60 dark:text-blue-300 dark:bg-blue-950/30",
    },
    CANCELED: {
      label: "Canceled",
      icon: <XCircle className="h-4 w-4" />,
      className:
        "border-red-200 text-red-700 bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:bg-red-950/30",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Order confirmation
          </h1>
          <p className="text-muted-foreground mt-1">
            Thank you! Your order <span className="font-mono">#{order.id}</span>{" "}
            has been received.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton
            variant="outline"
            size="sm"
            className="hidden md:inline-flex"
          >
            Print
          </PrintButton>
          <Button asChild variant="secondary" size="sm">
            <Link href="/orders">View all orders</Link>
          </Button>
        </div>
      </div>

      {order.status === "CANCELED" && (
        <Alert variant="destructive">
          <AlertTitle>Order canceled</AlertTitle>
          <AlertDescription>
            {order.cancelReason || "This order was canceled."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => {
                    const line = item.price.amount * item.quantity;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width={56}
                                height={56}
                                className="h-14 w-14 object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium leading-tight">
                                {item.product.name}
                              </div>
                              <div className="text-muted-foreground text-sm line-clamp-1">
                                {item.product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {currency.format(item.price.amount / 100)}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {currency.format(line / 100)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right: Summary & Customer */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Order summary</CardTitle>
                <CardDescription>
                  {order.orderItems.reduce((acc, it) => acc + it.quantity, 0)}{" "}
                  items
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={statusMeta[order.status].className}
              >
                <span className="mr-1 inline-flex items-center">
                  {statusMeta[order.status].icon}
                </span>
                <span className="capitalize">
                  {statusMeta[order.status].label}
                </span>
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currency.format(subtotal / 100)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{currency.format(SHIPPING_FEE / 100)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{currency.format(total / 100)}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  Taxes included where applicable. Shipping is added separately.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer</CardTitle>
              <CardDescription>
                Contact and shipping information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {order.customerInfo.firstName}{" "}
                      {order.customerInfo.lastName}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {order.customerInfo.email}
                    </div>
                  </div>
                  <CopyIdButton value={order.id} />
                </div>
                <Separator />
                <div className="text-sm leading-relaxed">
                  <div>{order.customerInfo.address}</div>
                  <div>
                    {order.customerInfo.postalCode} {order.customerInfo.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{countryLabel}</Badge>
                    {countryCode && (
                      <span className="text-muted-foreground uppercase text-xs">
                        {countryCode}
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Placed</div>
                    <div>{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  {order.paidAt && (
                    <div>
                      <div className="text-muted-foreground">Paid</div>
                      <div>{new Date(order.paidAt).toLocaleString()}</div>
                    </div>
                  )}
                  {order.completedAt && (
                    <div>
                      <div className="text-muted-foreground">Completed</div>
                      <div>{new Date(order.completedAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1" asChild>
              <Link href="/">Continue shopping</Link>
            </Button>
            <PrintButton className="flex-1" variant="outline">
              Print receipt
            </PrintButton>
          </div>
        </div>
      </div>
    </div>
  );
}
