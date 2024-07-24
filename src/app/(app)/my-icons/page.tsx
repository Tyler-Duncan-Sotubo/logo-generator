"use client";

import { useState, useEffect } from "react";
import type { Icons } from "@prisma/client";
import { api } from "@/trpc/react";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";
import { useSession } from "next-auth/react";

const Myicons = () => {
  const { status } = useSession();

  const icons = api.icons.getIcons.useQuery();
  const newIcons = api.icons.getIconsGeneratedInLast60Secs.useQuery();

  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (newIcons.isSuccess || icons.isSuccess) {
      setShowModal(false);
    }
  }, [newIcons.isSuccess, icons.isSuccess]);

  return (
    <>
      {/* Recently Generated Icons  */}
      {showModal && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex h-[30%] w-[80%] flex-col items-center justify-center">
            <Spinner />
          </div>
        </section>
      )}

      {status === "authenticated" ? (
        <>
          <section>
            <div className="relative mb-6 flex flex-col gap-2 border-b border-gray-200 py-6">
              <h1 className="text-2xl font-medium">Recently Generated Icons</h1>
            </div>
            {newIcons.data?.length === 0 ? (
              <h1 className="mt-6 text-lg">
                No New Icon Generated in the last 60 seconds
              </h1>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {newIcons.data?.map((icon: Icons) => (
                  <li key={icon.id}>
                    <Image
                      className="w-full rounded-xl"
                      width="256"
                      height="256"
                      alt={icon.prompt ?? "an image of an icon"}
                      src={`https://generator-logo.s3.amazonaws.com/${icon.id}.png`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Old icons */}
          <section className="min-h-screen">
            <div className="relative mb-6 flex flex-col gap-2 border-b border-gray-200 py-6">
              <h1 className="text-2xl font-medium">Icons</h1>
            </div>
            {icons.data?.length === 0 ? (
              <h1 className="mt-6 text-3xl font-medium">
                You have not created a Icon yet, Create One!
              </h1>
            ) : (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {icons.data?.map((icon: Icons) => (
                  <>
                    <li
                      key={icon.id}
                      className="group relative cursor-pointer duration-500 hover:scale-105"
                    >
                      <Image
                        className="w-full rounded-lg"
                        width="256"
                        height="256"
                        alt={icon.prompt ?? "an image of an icon"}
                        src={`https://generator-logo.s3.amazonaws.com/${icon.id}.png`}
                      />
                    </li>
                  </>
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

export default Myicons;
