"use client";

import { Post as PostTyle } from "@/generated/prisma";
import Image from "./Image";
import Post from "./Post";
import { useUser } from "@clerk/nextjs";
import { useActionState, useEffect } from "react";
import { commentPost } from "@/actions";

type CommentWithDetails = PostTyle & {
  user: {
    displayName: string | null;
    username: string;
    img: string | null;
  };
  _count: {
    likes: number;
    rePosts: number;
    comments: number;
  };
  likes: { id: number }[];
  rePosts: { id: number }[];
  saves: { id: number }[];
};

interface CommentPropType {
  comments: CommentWithDetails[];
  postId: number;
  username: string;
}

const Comments = ({ comments, postId, username }: CommentPropType) => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [state, formAction, isPending] = useActionState(commentPost, {
    success: false,
    error: false,
  });

  return (
    <div className="">
      {user && (
        <form
          action={formAction}
          className="flex items-center justify-between gap-4 p-4 "
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={user.imageUrl}
              alt="Lama Dev"
              width={100}
              height={100}
              tr={true}
            />
          </div>
          <input
            type="text"
            name="desc"
            className="flex-1 bg-transparent outline-none p-2 text-xl"
            placeholder="Post your reply"
          />
          <input type="number" name="postId" hidden readOnly value={postId} />
          <input
            type="string"
            name="username"
            hidden
            readOnly
            value={username}
          />
          <button
            disabled={isPending}
            className="py-2 px-4 font-bold bg-white text-black rounded-full disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            {isPending ? "Replying" : "Reply"}
          </button>
        </form>
      )}
      {state.error && <p className="text-red-400">Something went wrong.</p>}
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <Post post={comment} type="comment" />
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
