"use client";

import { deleteReview, editReview } from "@/actions/reviewActions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

function ReviewOperations({ user_id, review_id, message, initialRating }) {
  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(+initialRating);
  const router = useRouter();
  const formRef = useRef<any>();

  useEffect(() => {
    setRating(+initialRating);
  }, [initialRating, isEdit]);

  async function editReviewAction(formData: FormData) {
    const review = formData.get("review");
    const editedReview = {
      message: review,
      rating: parseFloat(rating?.toString()).toFixed(1),
    };
    await editReview(review_id, editedReview);
    setIsEdit(false);
    formRef?.current?.reset();
    router.refresh();
  }

  async function deleteReviewAction() {
    if (confirm("Are you sure you want to delete your review")) {
      await deleteReview(review_id);
      router.refresh();
    }
  }

  return (
    <>
      <div className={`flex gap-4 ${isEdit && "mb-2"}`}>
        <button
          className="bg-gray-200 p-2"
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>
        <button className="bg-gray-200 p-2" onClick={deleteReviewAction}>
          Delete
        </button>
      </div>
      {isEdit && (
        <form action={editReviewAction} ref={formRef}>
          <textarea
            name="review"
            id=""
            rows={3}
            placeholder="edit your review"
            className="w-full text-black border-black border-2"
            defaultValue={message}
            required
          />
          <div className="flex gap-2">
            <span>Product Rating: </span>
            <StarRating
              defaultRating={Number(initialRating)}
              userRating={rating}
              onSetRating={setRating}
              size={24}
            />
          </div>
          <button className="bg-white p-2 text-black border-2 border-black">
            Post
          </button>
        </form>
      )}
    </>
  );
}

export default ReviewOperations;
