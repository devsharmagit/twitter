"use server";

import { auth } from "@clerk/nextjs/server";
import { imageKit } from "./utils";
import { prisma } from "./prisma";

export const shareAction = async (
  formData: FormData,
  settings: {
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }
) => {
  const file = formData.get("file") as File;
  const desc = formData.get("desc") as string;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation = `w-600 ${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-9"
      : ""
  }`;

  imageKit.upload(
    {
      file: buffer,
      fileName: file.name,
      folder: "/posts",
      ...(file.type.includes("image") && {
        transformation: {
          pre: transformation,
        },
      }),
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    function (error, result) {
      if (error) console.log(error);
      console.log(result);
    }
  );

  console.log({ file, desc });
};

export const likePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingLike = await prisma.like.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }
};

export const rePostPost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingRepost = await prisma.post.findFirst({
    where: {
      rePostId: postId,
      userId: userId,
    },
  });

  if (existingRepost) {
    await prisma.post.delete({
      where: { id: existingRepost.id },
    });
  } else {
    await prisma.post.create({
      data: {
        userId,
        rePostId: postId,
      },
    });
  }
};

export const savePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existingSavePost = await prisma.savedPost.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });

  if (existingSavePost) {
    await prisma.savedPost.delete({
      where: { id: existingSavePost.id },
    });
  } else {
    await prisma.savedPost.create({
      data: {
        userId,
        postId: postId,
      },
    });
  }
};
