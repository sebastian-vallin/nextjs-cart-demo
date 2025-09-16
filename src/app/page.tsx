import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: {
        select: { amount: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center md:text-start">
        Cart Demo
      </h1>

      <div className="flex justify-center md:justify-start flex-wrap gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
