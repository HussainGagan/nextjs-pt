import PaginationButton from "@/components/PaginationButton";
import { formatCurrency, getProducts } from "@/utils";

export default async function Products({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { page = 1 } = searchParams as any;
  const { products, count } = await getProducts(+page);
  console.log(count);
  return (
    <div className="py-20">
      <h1 className="text-4xl mb-8">Product List</h1>
      <table>
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Colors</th>
            <th>Gender</th>
            <th>Brands</th>
            <th>Occasion</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="max-w-64">
                <p className="truncate w-full">{product.description}</p>
              </td>
              <td>
                <span className="line-through">
                  {formatCurrency(product.old_price)}
                </span>
                <br />
                <span>{formatCurrency(product.price)}</span> <br />
                <span>{product.discount}% off</span>
              </td>
              <td>{product.colors}</td>
              <td>{product.gender}</td>
              <td>{product.brands}</td>
              <td>{product.occasion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationButton count={count} />
    </div>
  );
}
