"use client";

import { addBrand } from "@/actions/brandActions";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function AddBrand() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<any>();
  const router = useRouter();

  async function brandAction(formData: FormData) {
    const brand = formData.get("brand");
    let website = formData.get("website") as string;
    if (!website?.startsWith("http")) {
      website = `http://${website}`;
    }
    const value = {
      name: brand,
      website,
    };
    await addBrand(value);
    setIsOpen(false);
    formRef?.current?.reset();
    router.refresh();
  }

  return (
    <div>
      <button
        className="p-3 bg-white text-black mt-4 mb-4 text-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Add Brand
      </button>

      {isOpen && (
        <form
          action={brandAction}
          className="flex flex-col gap-4"
          ref={formRef}
        >
          <div>
            <label htmlFor="brand">Brand Name: </label>
            <input
              type="text"
              name="brand"
              id="brand"
              className="w-1/3"
              placeholder="Enter Brand Name"
              required
            />
          </div>
          <div>
            <label htmlFor="website">Brand Website: </label>
            <input
              type="text"
              name="website"
              id="website"
              className="w-1/3"
              placeholder="Enter Website URL"
            />
          </div>
          <button className="w-max bg-gray-200 text-black p-2 ml-2">Add</button>
        </form>
      )}
    </div>
  );
}

export default AddBrand;
