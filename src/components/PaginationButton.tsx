"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "../../constant";

function PaginationButton({ count }: { count: number }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pageNo = searchParams.get("page") || 1;

  return (
    <div className="mt-12 p-4 bg-gray-800 flex justify-center gap-4 items-center">
      <button
        className="p-3 bg-slate-300 text-black"
        onClick={() => searchParams.set()}
      >
        &larr;Prev
      </button>
      <p>
        Page {pageNo} of {count / DEFAULT_PAGE_SIZE}{" "}
      </p>
      <button className="p-3 bg-slate-300 text-black">Next&rarr;</button>
    </div>
  );
}

export default PaginationButton;
