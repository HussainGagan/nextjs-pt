"use client";

import { useRouter } from "next/navigation";

function Empty() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Sorry, there are no products available</h1>
      <button className="bg-white p-4 text-black" onClick={() => router.back()}>
        Go Back
      </button>
    </div>
  );
}

export default Empty;
