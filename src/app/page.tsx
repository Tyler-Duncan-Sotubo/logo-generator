import { api, HydrateClient } from "@/trpc/server";
import { Header } from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import type { Logos } from "@prisma/client";
import { features } from "@/data/data";

const HeroComponent = () => (
  <section className="my-12 grid grid-cols-1 gap-20 sm:grid-cols-2">
    <div className="flex flex-col gap-10">
      <h1 className="mt-12 text-6xl font-medium">
        Change your brand identity with one click, Try Now!
      </h1>
      <p className="text-2xl">
        Use AI to generate logo in seconds take your brand to the next level.
      </p>
      <Link href="/generate-logo" className="self-start">
        <Button>Generated Your Logo</Button>
      </Link>
    </div>
    <Image
      src="/banner.png"
      alt="an image of a bunch of nice looking icons"
      width="500"
      height="400"
      className="order-first sm:-order-none"
    />
  </section>
);

export default async function Home() {
  const logos = await api.logos.getAllLogos();
  const icons = await api.icons.getAllIcons();

  const createIconsAndLogos = [...icons, ...logos];

  return (
    <HydrateClient>
      <header>
        <Header />
      </header>
      <main className="mx-auto w-[90%]">
        <HeroComponent />
        <section className="my-20">
          <h1 className="my-12 text-center text-2xl font-medium">
            Some Icons & Logos Created By Our Users
          </h1>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-8">
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

        <section className="my-36">
          <div className="text-center">
            <h3 className="my-2 text-4xl font-medium">Features</h3>
            <p className="mx-auto text-xl md:w-1/2">
              We have a lot of features that you can use to create your logo.
              Including AI generated logos, custom colors, 3D logos and much
              more.
            </p>
          </div>
          <ul className="my-12 grid grid-cols-1 items-center gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.title} className="flex flex-col items-center">
                <Image
                  src={feature.img}
                  alt={feature.title}
                  width="256"
                  height="256"
                  className="rounded-full"
                />
                <h4 className="my-4 text-center text-2xl font-medium">
                  {feature.title}
                </h4>
                <p className="text-center text-xl">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </HydrateClient>
  );
}
