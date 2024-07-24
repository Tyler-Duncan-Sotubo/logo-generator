import React from "react";
import { ApplicationLogo } from "./ApplicationLogo";
import { footerData } from "@/data/nav";
import Link from "next/link";

export const Footer = () => {
  // get the current year
  const year = new Date().getFullYear();
  return (
    <section className="min-h-40 bg-blue-950 text-white">
      <div className="mx-auto flex w-[95%] flex-col justify-between py-8 md:grid-cols-5 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <ApplicationLogo />
          <p>&copy; {year} WhiteStone LLC. All Rights Reserved</p>
        </div>
        <div>
          <ul className="my-10 flex flex-col gap-6 text-lg md:my-0 md:flex-row">
            {footerData.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer font-medium hover:text-zinc-500"
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
