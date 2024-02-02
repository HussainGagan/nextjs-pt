"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { occasionOptions } from "../../constant";

const discountOptions = [
  { value: "", label: "None" },
  { value: "0-5", label: "From 0% to 5%" },
  { value: "6-10", label: "From 6% to 10%" },
  { value: "11-15", label: "From 11 to 15%" },
];

async function fetchDataFromApi(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function Filter() {
  const queryParams = useSearchParams();
  const searchParams = new URLSearchParams(queryParams);
  const [brandsOption, setBrandsOption] = useState([]);
  const [defaultBrandsOption, setDefaultBrandsOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [selectedGender, setSelectedGender] = useState(
    () => searchParams.get("gender") || ""
  );
  const [sliderValue, setSliderValue] = useState(
    () => searchParams.get("priceRangeTo") || 2000
  );
  const [occasionOption, setOccasionOption] = useState([]);
  const [defaultOccasionOption, setDefaultOccasionOption] = useState(() =>
    searchParams
      .get("occasions")
      ?.split(",")
      .map((item) => ({ value: item, label: item }))
  );

  const [defaultDiscountOption, setDefaultDiscountOption] = useState(() => {
    const value = searchParams.get("discount");
    if (!value) return discountOptions[0];
    const [from, to] = value?.split("-");
    return { value, label: `From ${from}% to ${to}%` };
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchOptions() {
      // const brands = await fetchDataFromApi("/api/brands");
      // const categories = await fetchDataFromApi("/api/categories");

      const [brands, categories, occasion] = await Promise.all([
        fetchDataFromApi("/api/brands"),
        fetchDataFromApi("/api/categories"),
        // fetchDataFromApi("/api/occasion"),
      ]);

      // console.log(occasion);

      const brandsOption = brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      }));
      const categoriesOption = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      const occasionOption = occasionOptions.map((item) => {
        return {
          value: item,
          label: item,
        };
      });

      let defaultOptionBrands = [];
      let defaultOptionCategories = [];
      if (searchParams.get("brandId")) {
        const defaultBrandId = searchParams.get("brandId")?.split(",");

        defaultOptionBrands = defaultBrandId?.map((brandId) => {
          return {
            value: +brandId,
            label: brandsOption.find((option) => option.value === +brandId)
              .label,
          };
        });
      }
      if (searchParams.get("categoryId")) {
        const defaultCategoryId = searchParams.get("categoryId")?.split(",");

        defaultOptionCategories = defaultCategoryId?.map((categoryId) => {
          return {
            value: +categoryId,
            label: categoriesOption.find(
              (option) => option.value === +categoryId
            ).label,
          };
        });
      }

      setBrandsOption(brandsOption);
      setDefaultBrandsOption(defaultOptionBrands);
      setCategoriesOption(categoriesOption);
      setCategoriesSelected(defaultOptionCategories);
      setOccasionOption(occasionOption);
      setLoading(false);
    }
    fetchOptions();
  }, []);

  function handleBrandsSelect(e) {
    if (e.length === 0) {
      searchParams.delete("brandId");
      router.push(`/products?${searchParams.toString()}`);
      return;
    }

    const selectedBrandsId = e
      .map((selectedBrand) => selectedBrand.value)
      .join(",");

    searchParams.set("brandId", selectedBrandsId);
    router.push(`/products?${searchParams.toString()}`);
  }

  function handleCategoriesSelected(e) {
    setCategoriesSelected(e);
    if (e.length === 0) {
      searchParams.delete("categoryId");
      router.push(`/products?${searchParams.toString()}`);
      return;
    }
    const selectedCategoriesId = e
      .map((selectedCategory) => selectedCategory.value)
      .join(",");

    searchParams.delete("page");
    searchParams.delete("pageSize");
    searchParams.set("categoryId", selectedCategoriesId);
    router.push(`/products?${searchParams.toString()}`);
  }

  function handleSlider(e) {
    setSliderValue(e.target.value);
    searchParams.delete("page");
    searchParams.delete("pageSize");
    searchParams.set("priceRangeTo", `${e.target.value}`);
    router.push(`/products?${searchParams.toString()}`);
  }

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    if (!e.target.value) {
      searchParams.delete("gender");
      router.push(`/products?${searchParams.toString()}`);
      return;
    }
    searchParams.delete("page");
    searchParams.delete("pageSize");
    searchParams.set("gender", `${e.target.value}`);
    router.push(`/products?${searchParams.toString()}`);
  };

  function handleOccasions(e) {
    if (e.length === 0) {
      searchParams.delete("occasions");
      router.push(`/products?${searchParams.toString()}`);
      return;
    }

    const selectedOccasions = e
      .map((selectedOccasion) => selectedOccasion.value)
      .join(",");

    searchParams.delete("page");
    searchParams.delete("pageSize");
    searchParams.set("occasions", selectedOccasions);
    router.push(`/products?${searchParams.toString()}`);
  }

  function handleDiscount(e) {
    if (e.value === "") {
      searchParams.delete("discount");
      router.push(`/products?${searchParams.toString()}`);
      return;
    }
    searchParams.delete("page");
    searchParams.delete("pageSize");
    searchParams.set("discount", e.value);
    router.push(`/products?${searchParams.toString()}`);
  }

  function handleClearAll() {
    searchParams.delete("categoryId");
    searchParams.delete("brandId");
    searchParams.delete("priceRangeTo");
    searchParams.delete("gender");
    searchParams.delete("occasions");
    searchParams.delete("discount");
    router.push(`/products?${searchParams.toString()}`);
    router.refresh();
  }

  if (loading) {
    return <p className="text-lg">Loading options...</p>;
  }

  return (
    <div className="w-full">
      {/* <button className="bg-white p-2 my-4 text-black" onClick={handleClearAll}>
        Clear All
      </button> */}
      <p className="text-lg">Filter By</p>
      <div className="w-1/4 flex  items-center gap-4 mb-4">
        <span>Brands</span>
        <Select
          className="flex-1 text-black"
          options={brandsOption}
          isMulti
          name="brands"
          onChange={handleBrandsSelect}
          defaultValue={defaultBrandsOption}
        />
      </div>
      <div className="w-1/3 flex items-center gap-4 mb-4">
        <span>Categories</span>
        <MultiSelect
          className="text-black flex-1"
          options={categoriesOption}
          value={categoriesSelected}
          labelledBy="categories select"
          hasSelectAll={false}
          onChange={handleCategoriesSelected}
        />
      </div>
      <div>
        <span>Select products from Range 1 to 2000</span>
        <br />
        <span>Current Value {sliderValue}</span> <br />
        <input
          type="range"
          step="50"
          min="100"
          max="2000"
          value={sliderValue}
          onChange={handleSlider}
        />
      </div>
      <div>
        Select Gender: <br />
        <input
          type="radio"
          id="none"
          name="gender"
          value=""
          checked={selectedGender === ""}
          onChange={handleGenderChange}
        />
        <label htmlFor="none">None</label> <br />
        <input
          type="radio"
          id="men"
          name="gender"
          value="men"
          checked={selectedGender === "men"}
          onChange={handleGenderChange}
        />
        <label htmlFor="men">Men</label>
        <br />
        <input
          type="radio"
          id="women"
          name="gender"
          value="women"
          checked={selectedGender === "women"}
          onChange={handleGenderChange}
        />
        <label htmlFor="women">Women</label>
        <br />
        <input
          type="radio"
          id="boy"
          name="gender"
          value="boy"
          checked={selectedGender === "boy"}
          onChange={handleGenderChange}
        />
        <label htmlFor="boy">Boy</label>
        <br />
        <input
          type="radio"
          id="girl"
          name="gender"
          value="girl"
          checked={selectedGender === "girl"}
          onChange={handleGenderChange}
        />
        <label htmlFor="girl">Girl</label>
      </div>
      <div className="w-1/4 flex  items-center gap-4 mb-4">
        <span>Occasion</span>
        <Select
          className="flex-1 text-black"
          options={occasionOption}
          isMulti
          name="occasion"
          onChange={handleOccasions}
          defaultValue={defaultOccasionOption}
        />
      </div>

      <div className="w-1/4 flex  items-center gap-4 mb-4">
        <span>Filter By discount</span>
        <Select
          className="flex-1 text-black"
          options={discountOptions}
          name="discount"
          defaultValue={defaultDiscountOption}
          onChange={handleDiscount}
        />
      </div>
    </div>
  );
}

export default Filter;
