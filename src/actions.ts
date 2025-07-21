"use server";

import { auth } from "@clerk/nextjs/server";
import { imageKit } from "./utils";
import { prisma } from "./prisma";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
  } else {
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });
  }
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

export const commentPost = async (
  prev: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: true };
  }

  const desc = formData.get("desc");
  const username = formData.get("username");
  const postId = formData.get("postId");

  const Comment = z.object({
    parentPostId: z.number(),
    desc: z.string().max(140).min(3),
  });

  const validateFields = Comment.safeParse({
    parentPostId: Number(postId),
    desc: desc,
  });
  if (!validateFields.success) {
    return { success: false, error: true };
  }
  try {
    await prisma.post.create({
      data: {
        parentPostId: validateFields.data.parentPostId,
        desc: validateFields.data.desc,
        userId,
      },
    });
    revalidatePath(`/${username}/status/${postId}`);
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const addPost = async (
  prev: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: true };
  }

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive");
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
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
        },
        function (error, result) {
          if (error) reject(error);
          resolve(result as UploadResponse);
        }
      );
    });
  };

  const Post = z.object({
    desc: z.string().max(140).min(3),
    isSensitive: z.boolean().optional(),
  });

  const validateFields = Post.safeParse({
    desc: desc,
    isSensitive: isSensitive === "true" ? true : false,
  });
  if (!validateFields.success) {
    return { success: false, error: true };
  }
  try {
    let img = "";
    let imgHeight = 0;
    let video = "";

    if (file.size) {
      const result = await uploadFile(file);
      if (result.fileType === "image") {
        img = result.filePath;
        imgHeight = result.height;
      } else {
        video = result.filePath;
      }
    }

    await prisma.post.create({
      data: {
        userId,
        img,
        imgHeight,
        video,
        desc: validateFields.data.desc,
        isSensitive: validateFields.data.isSensitive,
      },
    });

    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
