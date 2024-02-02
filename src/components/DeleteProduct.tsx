"use client";

import { deleteProduct } from "@/actions/productActions";
import { useRouter } from "next/navigation";

function DeleteProduct({ productId }) {
  const router = useRouter();

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
      router.refresh();
    }
  }

  return (
    <>
      <button onClick={handleDelete}>Delete Product</button>
    </>
  );
}

export default DeleteProduct;
