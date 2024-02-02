import {
  MapBrandIdsToName,
  getAllProductCategories,
} from "@/actions/productActions";
import { getProducts } from "@/actions/productActions";
import { DEFAULT_PAGE_SIZE } from "../../../constant";
import PaginationSection from "@/components/PaginationSection";
import Link from "next/link";
import Modal from "@/components/Modal";
import SortBy from "@/components/SortBy";
import Filter from "@/components/Filter";
import Empty from "@/components/Empty";
import { formatCurrency } from "@/utils";
import Image from "next/image";
import DeleteProduct from "@/components/DeleteProduct";

export default async function Products({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    categoryId,
    priceRangeTo,
    gender,
    occasions,
    discount,
    brandId,
  } = searchParams as any;

  const { products, count } = await getProducts(
    +page,
    +pageSize,
    sortBy,
    categoryId,
    priceRangeTo,
    gender,
    occasions,
    discount,
    brandId
  );
  if (products.length === 0) {
    return <Empty />;
  }
  const brandsArr = new Set();
  for (let i = 0; i < products.length; i++) {
    const productBrands = JSON.parse(products.at(i)?.brands as string);
    productBrands?.forEach((productBrand) => {
      brandsArr.add(productBrand);
    });
  }

  const brandsId = [...brandsArr];
  const brandsMap = await MapBrandIdsToName(brandsId);
  const productCategories = await getAllProductCategories(products);

  function handleDeleteAction(formData, productId) {
    console.log({ formData, productId });
  }

  return (
    <div className="py-20">
      <h1 className="text-4xl mb-8">Product List</h1>
      <div className="mb-4">
        <SortBy />
        <Filter />
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Colors</th>
            <th>Rating</th>
            <th>Gender</th>
            <th>Categories</th>
            <th>Brands</th>
            <th>Occasion</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <Image
                  src={product.image_url || "/images/dummy.webp"}
                  alt="product image"
                  width="150"
                  height="100"
                />
              </td>
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
              <td>{product.rating}</td>
              <td>{product.gender}</td>
              <td>
                <div className="flex flex-col gap-2">
                  {productCategories.get(product.id).map((category, i) => {
                    return <span key={i}>{category.name}</span>;
                  })}
                </div>
              </td>
              <td>
                <div className="flex flex-col gap-2">
                  {[...new Set(JSON.parse(product.brands))].map(
                    (brandId, i) => {
                      return <span key={i}>{brandsMap.get(brandId)}</span>;
                    }
                  )}
                </div>
              </td>
              <td>{product.occasion}</td>
              <td>
                <div className="flex flex-col gap-2">
                  <span>
                    <Link href={`/products/${product.id}`}>See More</Link>
                  </span>
                  <Link href={`/products/${product.id}/edit`}>
                    Edit details
                  </Link>
                  <DeleteProduct productId={product.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationSection count={count} />

      <Link className="p-4 bg-white text-black" href={"/products/add"}>
        Add Product
      </Link>
    </div>
  );
}
