"use client";

import { deleteCategory, editCategory } from "@/actions/categoryActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EditCategory({ category }) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  async function handleEdit(formData: FormData) {
    try {
      const name = formData.get("name");
      // if (category.name === name) {
      //   alert("Category name is same");
      //   return;
      // }
      await editCategory(category.id, { name });
      alert(`Category Id: ${category.id} Edited`);
      setIsOpen(false);

      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 inline-block cursor-pointer ml-4"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>

      {isOpen && (
        <form action={handleEdit} className="mb-4 flex gap-4 items-center">
          <label htmlFor="name " className="select-none">
            Category Name:{" "}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={category.name}
          />
          <button className="bg-gray-200 text-black p-2">Edit</button>
        </form>
      )}
    </>
  );
}

export default EditCategory;
