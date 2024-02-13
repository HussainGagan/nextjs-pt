import AddCategory from "@/components/AddCategory";
import DeleteCategory from "@/components/DeleteCategory";
import EditCategory from "@/components/EditCategory";
import { convertToNestedCategories } from "@/utils";
import { getCategories } from "@/actions/categoryActions";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../utils/authOptions";
import { cookies } from "next/headers";

// export const dynamic = "force-dynamic";

async function Categories() {
  const categories = await getCategories();
  const session = await getServerSession(authOptions);
  const modifiedCategories = convertToNestedCategories(categories);

  function renderCategories(categories, depth) {
    return categories.map((category, i) => {
      return (
        <div
          key={i}
          className={`mb-2 ${depth === 0 && "border-b-2 border-violet-400"}`}
        >
          <div className="mb-4">
            <span>
              {Array.from({ length: depth }, () => (
                <>&emsp;</>
              ))}
            </span>
            <span>{i + 1}. </span>
            <span className="">{category.name}</span>
            {session ? (
              <>
                <DeleteCategory category_id={category.id} />
                <EditCategory category={category} />
              </>
            ) : null}
          </div>
          {renderCategories(category.subCategories, depth + 1)}
        </div>
      );
    });
  }

  return (
    <div className="pb-16">
      <h1 className="text-lg font-bold">All Categories & its SubCategories</h1>
      {!session && (
        <p className="text-lg mb-2">
          You need to sign in before performing any operations
        </p>
      )}
      {session && <AddCategory categories={categories} />}

      {renderCategories(modifiedCategories, 0)}
      {/* {modifiedCategories.map((category, i) => {
        return (
          <div key={i} className="mb-4">
            <span>{i + 1}. </span>
            <span>{category.name}</span>
          </div>
        );
      })} */}
    </div>
  );
}

export default Categories;
