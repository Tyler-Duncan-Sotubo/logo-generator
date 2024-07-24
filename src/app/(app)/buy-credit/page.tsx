"use client";

import { BsFillPatchCheckFill } from "react-icons/bs";
import { CreditsPricing } from "@/data/pricing";
import { BuyCreditButton } from "@/components/BuyCreditButton";
import Link from "next/link";

const BuyCredit = () => {
  return (
    <div className="min-h-screen">
      <h1 className="mt-10 py-3 text-center text-6xl font-medium">
        Buy Credit
      </h1>
      <h5 className="mx-auto my-10 w-1/2 text-center text-2xl">
        Every Logo or Icon you create deducts{" "}
        <span className="font-bold">One Credit</span>, all downloads are free
        for the logos created.
      </h5>

      {/* refund policy */}
      <h5 className="mx-auto my-10 self-center bg-orange-50 py-3 text-center text-xl font-medium text-black">
        Please review our{" "}
        <span className="text-red-600">
          <Link href="/refund">Refund Policy</Link>
        </span>{" "}
        carefully before purchasing any credits. We do not issue refunds.
      </h5>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-6 text-lg md:grid-cols-3">
          {CreditsPricing.map((feature, index) => (
            <div
              key={index}
              className={`border px-7 py-6 duration-1000 hover:scale-105 ${
                index === 1 &&
                "bg-blue-950 from-15% via-black via-30% to-black to-90% text-white"
              }`}
            >
              {index === 1 ? (
                <div className="text-right">
                  <p className="inline-block bg-white px-2 py-1 text-[10px] text-black">
                    Popular Plan
                  </p>
                </div>
              ) : (
                <div className="py-3" />
              )}
              <h1 className="mb-2 text-4xl capitalize">{feature.plan}</h1>
              <h6 className="font-light">{feature.description}</h6>
              <BuyCreditButton feature={feature} index={index} />
              <div className="mt-6">
                <h3 className="mb-3 font-bold">Features</h3>
                <ul className="mb-10 flex flex-col gap-2">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <BsFillPatchCheckFill className="text-primary" />
                      <p className="text-lg">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCredit;
