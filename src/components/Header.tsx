"use client";

import { navData } from "@/data/nav";
import { ApplicationLogo } from "./ApplicationLogo";
import { Button } from "./Button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { api } from "@/trpc/react";
import Image from "next/image";
import { DropDownLoggedIn } from "./DropDownLoggedIn";
import useComponentVisible from "@/hooks/useComponentVisible";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { data: session, status } = useSession();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const availableCredits = api.user.getUser.useQuery().data ?? 0;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const logout = async () => {
    try {
      const loggedOut = await signOut();
      if (loggedOut) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <>
      <nav className="mx-auto my-8 hidden w-[95%] items-center justify-between md:flex">
        <div className="flex items-center justify-between gap-10">
          <ApplicationLogo />
          {/* Nav Links */}
          <div className="flex items-center gap-6 text-lg">
            {navData.map((nav) => (
              <Link
                key={nav.title}
                href={nav.href}
                className="font-medium hover:text-zinc-500"
              >
                {nav.title}
              </Link>
            ))}
          </div>
        </div>
        {status === "unauthenticated" && (
          <div className="flex items-center gap-6">
            <Link
              href=""
              className="text-lg hover:text-zinc-400"
              onClick={() => signIn()}
            >
              Create Account
            </Link>
            <Button onClick={() => signIn()}>Log In</Button>
          </div>
        )}
        {status === "authenticated" && (
          <div className="flex items-center gap-6">
            <p className="text-lg">
              <span className="font-bold">{availableCredits}</span>{" "}
              {availableCredits === 1 ? "Credit" : "Credits"}
            </p>
            <Link href="/buy-credit">
              <Button>Buy Credit</Button>
            </Link>
            <div
              className="relative flex flex-col items-center gap-6"
              ref={ref as React.RefObject<HTMLDivElement>}
            >
              <Image
                src={session.user?.image ?? ""}
                width={40}
                height={40}
                alt="Profile Image"
                className="cursor-pointer rounded-full"
                onClick={() => setIsComponentVisible(!isComponentVisible)}
              />
              {isComponentVisible && <DropDownLoggedIn />}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <nav
        className="text-primary relative mb-10 mt-2 w-full md:hidden"
        id="nav"
      >
        <section className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <ApplicationLogo />
          <div className="flex items-center gap-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="z-[9998] cursor-pointer"
            >
              <GiHamburgerMenu className="text-4xl" />
            </button>
          </div>
        </section>
        <div
          className={`min-h-1/2 fixed top-0 z-[9999] w-[83%] cursor-pointer bg-white duration-300 ${isOpen ? "right-0 md:right-16" : "right-[-400px] opacity-0"}`}
        >
          <div className="flex justify-end px-5 py-5">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="z-[9999] cursor-pointer"
            >
              <MdClose className="text-4xl" />
            </button>
          </div>
          {status === "unauthenticated" && (
            <div className="flex flex-col-reverse gap-6 px-10">
              <Link
                href=""
                className="text-xl font-medium hover:text-zinc-400"
                onClick={() => signIn()}
              >
                Create Account
              </Link>
              <Button onClick={() => signIn()}>Log In</Button>
            </div>
          )}
          {/* Logged In Users */}
          {status === "authenticated" && (
            <div className="my-3 flex items-center gap-6 px-10">
              <Link href="/buy-credit" onClick={() => setIsOpen(!isOpen)}>
                <Button>Buy Credit</Button>
              </Link>
              <p className="text-lg">
                <span className="font-bold">{availableCredits}</span>{" "}
                {availableCredits === 1 ? "Credit" : "Credits"}
              </p>
            </div>
          )}
          {/* Mobile Navigation Links */}
          <ul className="px-10 py-3 pb-10">
            {navData.map((nav, index: number) => {
              return (
                <li
                  key={index}
                  className="text-background font-regular mt-3 text-xl capitalize"
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    key={nav.title}
                    href={nav.href}
                    className="cursor-pointer font-medium hover:text-zinc-500"
                  >
                    {nav.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Navigation Login Links */}
          {status === "authenticated" && (
            <ul className="flex flex-col gap-4 px-10 pb-10">
              <Link
                href="/my-logos"
                className="flex items-center gap-3 text-lg"
                onClick={() => setIsOpen(false)}
              >
                <p className="text-xl font-medium hover:text-zinc-500">
                  My Logos
                </p>
              </Link>
              <Link
                href="/my-icons"
                className="flex items-center gap-3 text-lg"
                onClick={() => setIsOpen(false)}
              >
                <p className="text-xl font-medium hover:text-zinc-500">
                  My Icons
                </p>
              </Link>
              <button
                className="flex items-center gap-3 text-lg"
                onClick={() => logout()}
              >
                <p className="text-xl font-medium hover:text-zinc-500">
                  Log Out
                </p>
              </button>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};
