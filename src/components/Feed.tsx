import React from "react";
import Post from "./Post";
import { prisma } from "@/prisma";
import { auth } from "@clerk/nextjs/server";
import InfiniteFeed from "./InfiniteFeed";

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
  const { userId } = await auth();
  if (!userId) return;

  const whereCondition = userProfileId
    ? { userId: userProfileId, parentPostId: null }
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

  const posts = await prisma.post.findMany({
    where: whereCondition,
    take: 3,
    skip: 0,
    orderBy: { createAt: "desc" },
    include: {
      user: { select: { displayName: true, username: true, img: true } },
      rePost: {
        include: {
          user: { select: { displayName: true, username: true, img: true } },
          _count: {
            select: { likes: true, comments: true, rePosts: true },
          },
          likes: { where: { userId: userId }, select: { id: true } },
        },
      },
      _count: {
        select: { likes: true, comments: true, rePosts: true },
      },
      likes: { where: { userId: userId }, select: { id: true } },
    },
  });
  console.log("###################################");
  console.log(posts[0]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
      <InfiniteFeed />
    </div>
  );
};

export default Feed;
