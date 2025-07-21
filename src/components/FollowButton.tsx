"use client";

import { followUser } from "@/actions";
import { useUser } from "@clerk/nextjs";
import React, { useOptimistic, useState } from "react";

const FollowButton = ({
  isFollowed,
  userId,
}: {
  isFollowed: boolean;
  userId: string;
}) => {
  const [state, setState] = useState(isFollowed);

  // const { user } = useUser();

  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  const followAction = async () => {
    switchOptimisticFollow("");
    await followUser(userId);
    setState((prev) => !prev);
  };

  return (
    <form action={followAction}>
      <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
        {optimisticFollow ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
};

export default FollowButton;
