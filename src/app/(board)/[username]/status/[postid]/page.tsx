import Comments from "@/components/Comment";
import Image from "@/components/Image";
import Post from "@/components/Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const StatusPage = async ({
  params,
}: {
  params: Promise<{ username: string; postid: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const postId = (await params).postid;

  const post = await prisma.post.findFirst({
    where: { id: Number(postId) },
    include: {
      user: { select: { displayName: true, username: true, img: true } },
      _count: {
        select: { likes: true, comments: true, rePosts: true },
      },
      likes: { where: { userId: userId }, select: { id: true } },
      rePosts: { where: { userId: userId }, select: { id: true } },
      saves: { where: { userId: userId }, select: { id: true } },
      comments: {
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: {
            select: { likes: true, comments: true, rePosts: true },
          },
          likes: { where: { userId: userId }, select: { id: true } },
          rePosts: { where: { userId: userId }, select: { id: true } },
          saves: { where: { userId: userId }, select: { id: true } },
        },
      },
    },
  });

  if (!post) {
    return notFound();
  }
  console.log("looks below my darling");
  console.log(post);

  return (
    <div className="">
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" width={24} height={24} />
        </Link>
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <Post type="status" post={post} />
      <Comments
        comments={post.comments}
        postId={post.id}
        username={post.user.username}
      />
    </div>
  );
};

export default StatusPage;
