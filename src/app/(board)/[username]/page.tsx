import Feed from "@/components/Feed";
import Image from "@/components/Image";
import { prisma } from "@/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const UserPage = async ({ params }: { params: { username: string } }) => {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    return notFound();
  }
  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#00000084]">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" width={24} height={24} />
        </Link>
        <h1 className="font-bold text-lg">Lama Dev</h1>
      </div>
      {/* INFO */}
      <div className="">
        {/* COVER & AVATAR CONTAINER */}
        <div className="relative w-full">
          {/* COVER */}
          <div className="w-full aspect-[3/1] relative">
            <Image
              path="general/cover.jpg"
              alt=""
              width={600}
              height={200}
              tr={true}
            />
          </div>
          {/* AVATAR */}
          <div className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2">
            <Image
              path="general/avatar.png"
              alt=""
              width={100}
              height={100}
              tr={true}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 p-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/more.svg" alt="more" width={20} height={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/explore.svg" alt="more" width={20} height={20} />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer">
            <Image path="icons/message.svg" alt="more" width={20} height={20} />
          </div>
          <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
            Follow
          </button>
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          {/* USERNAME & HANDLE */}
          <div className="">
            <h1 className="text-2xl font-bold">Lama Dev</h1>
            <span className="text-textGray text-sm">@lamaWebDev</span>
          </div>
          <p>Lama Dev Youtube Channel</p>
          {/* JOB & LOCATION & DATE */}
          <div className="flex gap-4 text-textGray text-[15px]">
            <div className="flex items-center gap-2">
              <Image
                path="icons/userLocation.svg"
                alt="location"
                width={20}
                height={20}
              />
              <span>USA</span>
            </div>
            <div className="flex items-center gap-2">
              <Image path="icons/date.svg" alt="date" width={20} height={20} />
              <span>Joined May 2021</span>
            </div>
          </div>
          {/* FOLLOWINGS & FOLLOWERS */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">100</span>
              <span className="text-textGray text-[15px]">Followings</span>
            </div>
          </div>
        </div>
      </div>
      {/* FEED */}
      <Feed userProfileId={user.id} />
    </div>
  );
};

export default UserPage;
