"use client";

import React from "react";

const FollowButton = ({
  isFollowed,
  userId,
}: {
  isFollowed: boolean;
  userId: string;
}) => {
  return (
    <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
      {isFollowed ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
