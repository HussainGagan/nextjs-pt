import { getProducts } from "@/utils";

export default async function Products() {
  const products = await getProducts();

  console.log(products);

  return (
    <div>
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
            <th>Discount</th>
            <th>Brands</th>
            <th>Occasion</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                {!!Number(product.discount) && (
                  <span className="line-through">{product.price}</span>
                )}
                {"    "}
                <span>
                  {Number(
                    Number(product.price) -
                      Number(product.price) * (Number(product.discount) / 100)
                  ).toFixed(2)}
                </span>
              </td>
              <td>{product.colors}</td>
              <td>{product.gender}</td>
              <td>{product.discount}%</td>
              <td>{product.brands}</td>
              <td>{product.occasion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
