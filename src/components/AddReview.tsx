"use client";

import { postReview } from "@/actions/reviewActions";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import StarRating from "./StarRating";

function AddReview({ product_id }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const formRef = useRef<any>();

  async function reviewSubmit(formData: FormData) {
    const review = formData.get("review");
    console.log({ review });
    if (!review || !rating) {
      alert("please fill all the fields");
      return;
    }
    const post = {
      user_id: session?.user.id,
      product_id,
      message: review,
      rating: parseFloat(rating?.toString()).toFixed(1),
    };
    await postReview(post);
    setRating(0);
    formRef?.current?.reset();
    router.refresh();
  }

  return (
    <div>
      <form action={reviewSubmit} ref={formRef}>
        <textarea
          name="review"
          id=""
          rows={3}
          placeholder="post your review"
          className="w-full text-black"
          required
        />
        <div className="flex gap-2">
          <span>Product Rating: </span>
          <StarRating userRating={rating} onSetRating={setRating} size={24} />
        </div>
        {/* <input
          type="number"
          className="text-black mr-4"
          name="rating"
          id="rating"
          defaultValue={0}
          min={0}
          max={5}
          required
          step={0.1}
        ></input> */}
        <button
          className="bg-white p-2 text-black disabled:cursor-not-allowed"
          disabled={!session}
        >
          Post
        </button>
      </form>
      {!session && <p>You need to sigin before posting any review</p>}
    </div>
  );
}

export default AddReview;
