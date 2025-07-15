import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuList = [
  {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: "home.svg",
  },
  {
    id: 2,
    name: "Explore",
    link: "/",
    icon: "explore.svg",
  },
  {
    id: 3,
    name: "Notification",
    link: "/",
    icon: "notification.svg",
  },
  {
    id: 4,
    name: "Messages",
    link: "/",
    icon: "message.svg",
  },
  {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: "bookmark.svg",
  },
  {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: "job.svg",
  },
  {
    id: 7,
    name: "Communities",
    link: "/",
    icon: "community.svg",
  },
  {
    id: 8,
    name: "Premium",
    link: "/",
    icon: "logo.svg",
  },
  {
    id: 9,
    name: "Profile",
    link: "/",
    icon: "profile.svg",
  },
  {
    id: 10,
    name: "More",
    link: "/",
    icon: "more.svg",
  },
];


const LeftBar = () => {
  return (
    <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
        
        {/* Logo menu button */}
        <div className="flex flex-col gap-4 text-lg items-center xxl:items-start">
            {/* logo */}
            <Link href={"/"} className='p-2 rounded-full hover:bg-[#181818]'>
                <Image src={"icons/logo.svg"} alt='logo' width={24} height={24} />
            </Link>

            {/* menu list */}
            <div className="flex flex-col gap-4">
                {menuList.map(item=>(
                    <Link href={item.link} key={item.id} className='p-2 rounded-full hover:bg-[#181818] flex items-center gap-4'>
                        <Image src={`icons/${item.icon}`} alt={item.name} width={24} height={24}/>
                        <span className='hidden xxl:inline'> {item.name} </span>
                    </Link>
                ))}
            </div>
            {/* button */}
            
        </div>

        {/* User section  */}
        <div className=""></div>
    </div>
  )
}

export default LeftBar