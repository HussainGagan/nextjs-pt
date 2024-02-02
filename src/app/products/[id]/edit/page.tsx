"use client";

import { basicSchema } from "@/schemas";
import { getAllCategories } from "@/actions/categoryActions";
import { getAllBrands } from "@/actions/brandActions";
import {
  MapBrandIdsToName,
  getProduct,
  getProductCategories,
  updateProduct,
  updateProductCategories,
} from "@/actions/productActions";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Select from "react-select";
import { occasionOptions } from "../../../../../constant";
import { useRouter } from "next/navigation";

function EditProduct({ params }: { params: { id: string } }) {
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [brandsOption, setBrandsOption] = useState([]);
  const [occasionOption, setOccasionOption] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);

  const router = useRouter();
  const {
    values: product,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      name: "",
      description: "",
      old_price: "",
      discount: "",
      rating: 0,
      colors: "",
      brands: null,
      categories: null,
      gender: "",
      occasion: null,
      image_url: "",
    },
    validationSchema: basicSchema,

    onSubmit: async (values, actions) => {
      const brandIds = JSON.stringify(
        values.brands.map((brand) => brand.value)
      );
      const occasion = values.occasion
        .map((occasion) => occasion.value)
        .join(",");

      const categoryIds = values?.categories.map((category) => category.value);
      console.log(categoryIds);
      const updatedProduct = {
        name: values.name,
        description: values.description,
        old_price: Number(values.old_price).toFixed(2).toString(),
        discount: Number(values.discount).toFixed(2).toString(),
        colors: values.colors,
        brands: brandIds,
        gender: values.gender,
        occasion: occasion,
        rating: Number(values.rating).toFixed(1).toString(),
        ...(values.image_url ? { image_url: values.image_url } : {}),
      };
      console.log(updatedProduct);
      await new Promise((res) => setTimeout(res, 1000));
      await updateProduct(+id, updatedProduct);
      await updateProductCategories(+id, categoryIds);
      router.push(`/products/${id}/edit`);
      router.refresh();
      console.log("submitted");
    },
  });

  useEffect(() => {
    setLoading(true);
    (async function () {
      const [productArr] = await getProduct(id);
      const brands = await getAllBrands();
      const brandsOption = brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      }));
      setBrandsOption(brandsOption as any);
      const selectedBrands = await MapBrandIdsToName(
        JSON.parse(productArr.brands)
      );
      const defaultBrandsOption = JSON.parse(productArr.brands).map((item) => ({
        value: item,
        label: selectedBrands.get(item),
      }));

      const categories = await getAllCategories();
      const categoriesOption = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      const initialCategories = await getProductCategories(id);
      const defaultCategories = initialCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      console.log(defaultCategories);
      setCategoriesOption(categoriesOption as any);

      const occasionOption = occasionOptions.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      const initialOccasion = productArr.occasion.split(",").map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      setOccasionOption(occasionOption as any);
      const product = {
        name: productArr.name,
        description: productArr.description,
        old_price: productArr.old_price,
        discount: productArr.discount,
        colors: productArr.colors,
        brands: defaultBrandsOption,
        categories: defaultCategories,
        gender: productArr.gender,
        occasion: initialOccasion,
        rating: +productArr.rating,
        image_url: "",
      };
      setValues(product);
      setLoading(false);
    })();
  }, [id, setValues]);

  function handleChangeSelect(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        brands: null,
      });
      return;
    }
    setValues({
      ...product,
      brands: selectedOptions,
    });
  }
  function handleOccasion(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        occasion: null,
      });
      return;
    }
    setValues({
      ...product,
      occasion: selectedOptions,
    });
  }
  function handleCategories(selectedOptions) {
    if (selectedOptions.length === 0) {
      setValues({
        ...product,
        categories: null,
      });
      return;
    }
    setValues({
      ...product,
      categories: selectedOptions,
    });
  }

  function handleFileInput(e) {
    const file = e.target.files[0];
    setValues({
      ...product,
      image_url: `/images/${file.name}`,
    });
  }

  if (loading) return <h2>Loading...</h2>;

  if (isSubmitting) return <h1 className="text-2xl">Submitting...</h1>;

  return (
    <div className="w-1/3 text-white">
      <h1 className="mb-8 text-xl">Edit details of Product {id}</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>
        <div>
          <label htmlFor="description">Product description: </label>
          <textarea
            className="text-black"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={5}
            cols={30}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label htmlFor="description" id="price">
            Product old price:{" "}
          </label>
          <input
            type="number"
            name="old_price"
            placeholder="Enter old price"
            value={product.old_price}
            onChange={handleChange}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="discount">Product Discount: </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={product.discount}
            onChange={handleChange}
            step={0.1}
            placeholder="Enter product discount"
          />
        </div>
        <div></div>
        <div>
          <label htmlFor="colors">Product colors: </label>
          <input
            type="text"
            name="colors"
            id="colors"
            placeholder="Enter product colors"
            onChange={handleChange}
            value={product.colors}
          />
        </div>
        <div>
          <label htmlFor="rating">Product Rating: </label>
          <input
            type="number"
            className="text-black"
            name="rating"
            id="rating"
            min={0}
            max={5}
            value={product.rating}
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="gender">Product Gender: </label>
          <select
            className="text-black"
            name="gender"
            id="gender"
            value={product.gender}
            onChange={handleChange}
          >
            {["men", "boy", "women", "girl"].map((gender, i) => {
              return (
                <option key={i} value={gender}>
                  {gender}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="brands">Brands</label>
          <Select
            className="flex-1 text-black"
            options={brandsOption}
            isMulti
            name="brands"
            onChange={handleChangeSelect}
            value={product.brands}
          />
        </div>

        <div className=" flex items-center gap-4 mb-4">
          <span>Choose Categories</span>
          <Select
            className="flex-1 text-black"
            options={categoriesOption}
            isMulti
            name="categories"
            onChange={handleCategories}
            value={product.categories}
          />
        </div>

        <div className=" flex  items-center gap-4 mb-4">
          <span>Occasion</span>
          <Select
            className="flex-1 text-black"
            options={occasionOption}
            isMulti
            name="occasion"
            onChange={handleOccasion}
            value={product.occasion}
          />
        </div>

        <div className=" flex  items-center gap-4 mb-4">
          <label htmlFor="image_url">Upload an image</label>
          <input
            className="text-white"
            type="file"
            name="image_url"
            id="image_url"
            onChange={handleFileInput}
            accept="image/*"
          />
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-1/2 p-4 bg-white text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
