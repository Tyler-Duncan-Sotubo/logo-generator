import { api } from "@/trpc/server";
import Image from "next/image";
import type { Logos } from "@prisma/client";

const page = async () => {
  const logos = await api.logos.getAllLogos();
  const icons = await api.icons.getAllIcons();

  const createIconsAndLogos = [...icons, ...logos];
  return (
    <section className="min-h-screen">
      <h1 className="text-3xl font-medium">
        Some Icons & Logos Created By Our Users
      </h1>
      <ul className="mb-20 mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
        {createIconsAndLogos.map((logo: Logos) => (
          <li key={logo.id}>
            <Image
              className="w-full rounded-lg"
              width="256"
              height="256"
              alt={logo.prompt ?? "an image of an logo"}
              src={`https://generator-logo.s3.amazonaws.com/${logo.id}.png`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default page;
