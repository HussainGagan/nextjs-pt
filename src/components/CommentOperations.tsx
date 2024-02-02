"use client";

import { deleteCommentAndReplies, editComment } from "@/actions/commentActions";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function CommentOperations({ comment_id, comment }) {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const formRef = useRef<any>();

  async function editCommentAction(formData: FormData) {
    const comment = formData.get("comment");

    const updatedComment = {
      comment,
    };

    await editComment(comment_id, updatedComment);
    formRef?.current?.reset();
    setIsEdit(false);
    router.refresh();
  }

  async function deleteCommentAction() {
    if (confirm("Are you sure you want to delete your comment")) {
      await deleteCommentAndReplies(comment_id);
      router.refresh();
    }
  }

  return (
    <>
      <div className={`flex gap-4 ${isEdit && "mb-2"}`}>
        <button
          className="bg-gray-200 p-2 text-sm"
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>
        <button
          className="bg-gray-200 p-2 text-sm"
          onClick={deleteCommentAction}
        >
          Delete
        </button>
      </div>

      {isEdit && (
        <div className="mb-2">
          <form action={editCommentAction} ref={formRef}>
            <textarea
              name="comment"
              id=""
              rows={3}
              placeholder="post your comment"
              className="w-full text-black border-black border-2"
              defaultValue={comment}
              required
            />
            <button className="bg-white p-2 text-black border-2 border-black">
              post
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CommentOperations;
