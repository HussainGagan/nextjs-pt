"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "../../constant";

function PaginationSection({ count }: { count: number }) {
  const router = useRouter();

  const query = useSearchParams();
  const searchParams = new URLSearchParams(query);
  const pageNo = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;
  const lastPage = Math.ceil(count / pageSize);

  function handlePrev() {
    if (pageNo > 1) {
      searchParams.set("page", `${pageNo - 1}`);
      router.push(`/products?${searchParams.toString()}`, {
        scroll: false,
      });
    }
  }

  function handleNext() {
    if (pageNo < lastPage) {
      searchParams.set("page", `${pageNo + 1}`);
      router.push(`/products?${searchParams.toString()}`, {
        scroll: false,
      });
    }
  }

  return (
    <div className="mt-12 p-4 bg-gray-800 flex justify-center gap-4 items-center mb-8">
      <select
        value={pageSize}
        name="page-size"
        className="text-black"
        onChange={(e) => {
          searchParams.set("page", 1);
          searchParams.set("pageSize", e.target.value);
          router.push(`/products?${searchParams.toString()}`, {
            scroll: false,
          });
        }}
      >
        {["10", "25", "50"].map((val) => {
          return (
            <option key={val} value={val}>
              {val}
            </option>
          );
        })}
      </select>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === 1}
        onClick={handlePrev}
      >
        &larr;Prev
      </button>
      <p>
        Page {pageNo} of {lastPage}{" "}
      </p>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === lastPage}
        onClick={handleNext}
      >
        Next&rarr;
      </button>
    </div>
  );
}

export default PaginationSection;
