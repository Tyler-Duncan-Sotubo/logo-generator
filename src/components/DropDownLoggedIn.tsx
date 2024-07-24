"use client";

import Link from "next/link";
import { FaImages } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { GiCondyluraSkull } from "react-icons/gi";

export const DropDownLoggedIn = () => {
  const { data: session } = useSession();
  return (
    <div className="absolute right-1/4 top-full z-[9999]">
      <div className="w-80 rounded-md border-2 border-zinc-200 bg-white px-4 py-6 shadow-md">
        <div className="relative mb-4 flex items-center gap-2 border-b-2 py-4">
          <Image
            src={session?.user?.image ?? ""}
            width={60}
            height={60}
            alt="Profile Image"
            className="cursor-pointer rounded-full"
          />
          <div className="text-sm font-semibold">
            <p>{session?.user?.name}</p>
            <p>{session?.user?.email}</p>
          </div>
        </div>
        <ul className="mt-6 flex flex-col gap-4">
          <Link href="/my-logos" className="flex items-center gap-3 text-lg">
            <FaImages className="flex items-center gap-2 text-3xl" />
            My Logos
          </Link>
          <Link href="/my-icons" className="flex items-center gap-3 text-lg">
            <GiCondyluraSkull className="flex items-center gap-2 text-3xl" />
            My Icons
          </Link>
          <button
            className="flex items-center gap-3 text-lg"
            onClick={() => signOut()}
          >
            <MdLogout className="flex items-center gap-2 text-3xl" />
            Log Out
          </button>
        </ul>
      </div>
    </div>
  );
};
