import { Post as PostTyle } from "@/generated/prisma";
import Image from "./Image";
import Post from "./Post";

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
  return (
    <div className="">
      <form className="flex items-center justify-between gap-4 p-4 ">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            path="general/avatar.png"
            alt="Lama Dev"
            width={100}
            height={100}
            tr={true}
          />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent outline-none p-2 text-xl"
          placeholder="Post your reply"
        />
        <button className="py-2 px-4 font-bold bg-white text-black rounded-full">
          Reply
        </button>
      </form>
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
