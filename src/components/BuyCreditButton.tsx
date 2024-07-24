"use client";

import { useBuyCredits } from "@/hooks/useBuyCredits";

type BuyCreditButtonProps = {
  feature: {
    plan: string;
    description: string;
    price: string;
    features: string[];
  };
  index: number;
};

export const BuyCreditButton = ({ feature, index }: BuyCreditButtonProps) => {
  const { buyCredits } = useBuyCredits({ price: feature.price });
  return (
    <div className="my-3 flex flex-col">
      <button
        onClick={() => buyCredits().catch(console.error)}
        className={`py-3 ${
          index === 1 ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        <p className="font-bold">BUY NOW FOR ${feature.price}</p>
      </button>
    </div>
  );
};
