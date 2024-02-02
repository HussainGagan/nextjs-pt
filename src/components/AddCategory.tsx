"use client";
import { selectCategoriesFormat } from "@/utils";
import { getAllCategories } from "@/actions/categoryActions";
import { postCategory } from "@/actions/categoryActions";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

function AddCategory({ categories }) {
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const categoriesOption = selectCategoriesFormat(categories);
  const [selectedCategory, setSelectedCategory] = useState<any>({
    value: "",
    label: "None",
  });
  const router = useRouter();

  function handleCategories(selectedCategories) {
    setSelectedCategory(selectedCategories);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const category = {
        name: categoryName,
        ...(selectedCategory.value && { parent_id: selectedCategory.value }),
      };
      await postCategory(category);
      setCategoryName("");
      setSelectedCategory({ value: "", label: "None" });
      setIsOpen(false);
      alert("category submitted");
      router.refresh();
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="mb-6">
      <button
        className="p-4 bg-white text-black mt-4 mb-4 text-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Add Category
      </button>

      {isOpen && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="category">Category Name:</label>
              <input
                type="text"
                name="category"
                id="category"
                className="w-1/3"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Name"
                required
              />
            </div>
            <div>
              <span>Select Parent Category</span>
              <Select
                isSearchable
                className="text-black w-1/3"
                options={categoriesOption}
                // defaultValue={categoriesOption[0]}
                name="categories"
                onChange={handleCategories}
                value={selectedCategory}
              />
            </div>

            <button type="submit" className="bg-gray-200 text-black p-2 mt-4">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddCategory;
