import Image from "@/components/Image";
import Link from "next/link";

const UserPage = () => {
  return (
    <div>
      {/* profile title */}
      <div className="flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-black">
        <Link href="/">
          <Image path="icons/back.svg" alt="back" width={24} height={24} />
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
