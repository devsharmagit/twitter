import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const userProfileId = searchParams.get("user");
  const page = searchParams.get("cursor");
  const LIMIT = 3;

  const { userId } = await auth();
  if (!userId) return;

  const whereCondition =
    userProfileId !== "undefined"
      ? { userId: userProfileId as string, parentPostId: null }
      : {
          parentPostId: null,
          userId: {
            in: [
              userId,
              ...(
                await prisma.follow.findMany({
                  where: { followerId: userId },
                  select: { followingId: true },
                })
              ).map((follow) => follow.followingId),
            ],
          },
        };

  const postIncludeQuery = {
    user: { select: { displayName: true, username: true, img: true } },
    _count: { select: { likes: true, rePosts: true, comments: true } },
    likes: { where: { userId: userId }, select: { id: true } },
    rePosts: { where: { userId: userId }, select: { id: true } },
    saves: { where: { userId: userId }, select: { id: true } },
  };

  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      rePost: {
        include: postIncludeQuery,
      },
      ...postIncludeQuery,
    },
    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT,
    orderBy: { createAt: "desc" },
  });

  const totalPosts = await prisma.post.count({ where: whereCondition });
  console.log("i am a super man");
  console.log({ totalPosts });

  const hasMore = Number(page) * LIMIT < totalPosts;

  return Response.json({ posts, hasMore });
}
