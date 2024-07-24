import { refundPolicies } from "@/data/refund";
import React from "react";

type RefundPolicy = {
  policy: string;
  details: string;
};

const page = () => {
  return (
    <div>
      <h1 className="text-center text-5xl">Refund Policy</h1>
      <h5 className="my-4 text-xl">
        Thank you for choosing our Image/Logo Generator Web Application. Our
        mission is to provide innovative AI-driven image generation services.
        While we strive to offer the best possible experience, it is important
        to understand the limitations of AI technology. Please read this policy
        carefully before making a purchase, as all sales are final and
        non-refundable.
      </h5>
      {/* refund policy */}

      <ul className="mx-auto w-[97%]">
        {refundPolicies.map((policy, index) => (
          <li key={index}>
            <div className="flex gap-3">
              <h3 className="my-5 text-2xl font-medium">{index + 1}.</h3>
              <h3 className="my-5 text-2xl font-medium">{policy.title}</h3>
            </div>

            <p className="text-xl">{policy.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
