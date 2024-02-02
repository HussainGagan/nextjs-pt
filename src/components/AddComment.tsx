"use client";

import { postComment } from "@/actions/commentActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function AddComment({
  product_id,
  parent_comment_id = null,
  text = "Add comment",
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState();
  // const session = await getServerSession();
  const router = useRouter();
  const formRef = useRef<any>();

  async function commentSubmit(formData: FormData) {
    const comment = formData.get("comment");
    const post = {
      user_id: session?.user.id,
      product_id,
      comment,
      parent_comment_id,
    };
    await postComment(post);
    formRef?.current?.reset();
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        className="w-max text-sm p-2 bg-gray-200 text-black disabled:cursor-not-allowed"
        disabled={!session}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {text}
      </button>
      {!session && <p>You need to sigin before posting any comments</p>}

      {isOpen && (
        <div className="mb-2">
          <form action={commentSubmit} ref={formRef}>
            <textarea
              name="comment"
              id=""
              rows={3}
              placeholder="post your comment"
              className="w-full text-black border-black border-2"
              required
            />
            <button
              className="bg-white p-2 text-black border-2 border-black disabled:cursor-not-allowed"
              disabled={!session}
            >
              post
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AddComment;
