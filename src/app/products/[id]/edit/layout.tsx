import { getProduct } from "@/actions/productActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const { product: productArr, error } = await getProduct(+id);
  const product = productArr[0];

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
