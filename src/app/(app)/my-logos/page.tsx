"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Logos } from "@prisma/client";
import { api } from "@/trpc/react";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";

const MyLogos = () => {
  const { status } = useSession();
  const [showModal, setShowModal] = useState(true);

  const logos = api.logos.getLogos.useQuery();
  const newLogos = api.logos.getLogosGeneratedInLast60Secs.useQuery();

  useEffect(() => {
    if (newLogos.isPending || logos.isPending) {
      setShowModal(false);
    }
  }, [newLogos.isPending, logos.isPending]);

  return (
    <>
      {showModal && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex h-[30%] w-[80%] flex-col items-center justify-center">
            <Spinner />
          </div>
        </section>
      )}

      {status === "authenticated" ? (
        <>
          {" "}
          {/* Recently Generated Logos  */}
          <section>
            <div className="relative mb-6 flex flex-col gap-2 border-b border-gray-200 py-6">
              <h1 className="text-2xl font-medium">Recently Generated Logos</h1>
            </div>
            {newLogos.data?.length === 0 ? (
              <h1 className="mt-6 text-lg">
                No New Logo Generated in the last 60 seconds
              </h1>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {newLogos.data?.map((logo: Logos) => (
                  <li key={logo.id}>
                    <Image
                      className="w-full rounded-xl"
                      width="256"
                      height="256"
                      alt={logo.prompt ?? "an image of an logo"}
                      src={`https://generator-logo.s3.amazonaws.com/${logo.id}.png`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Old Logos */}
          <section className="min-h-screen">
            <div className="relative mb-6 flex flex-col gap-2 border-b border-gray-200 py-6">
              <h1 className="text-2xl font-medium">Logos</h1>
            </div>
            {logos.data?.length === 0 ? (
              <h1 className="mt-6 text-3xl font-medium">
                You have not created a logo yet, Create One!
              </h1>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {logos.data?.map((logo: Logos) => (
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
            )}
          </section>
        </>
      ) : (
        <section className="flex items-center justify-center">
          <h2 className="my-56 text-4xl">
            You need to be logged in to view your icons
          </h2>
        </section>
      )}
    </>
  );
};

export default MyLogos;
