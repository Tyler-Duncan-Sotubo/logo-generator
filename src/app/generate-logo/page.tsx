"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/Input";
import { FormGroup } from "@/components/FormGroup";
import { useSession, signIn, signOut } from "next-auth/react";

const GenerateLogo = () => {
  const [formData, setFormData] = useState({
    logoName: "",
    tagLine: "",
  });

  const { data: session, status } = useSession();

  const updateForm = (key: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  };

  const generateLogo = api.generate.generateLogo.useMutation({
    onSettled: () => {
      setFormData({
        logoName: "",
        tagLine: "",
      });
    },
    onSuccess: (data) => {
      alert("Logo generated! " + data.logoUrl);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateLogo.mutate(formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <h1 className="my-20 text-6xl">Generate Logo</h1>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <FormGroup>
          <label>Logo Name</label>
          <Input
            value={formData.logoName}
            onChange={updateForm("logoName")}
          ></Input>
        </FormGroup>
        <FormGroup>
          <label>TagLine</label>
          <Input
            value={formData.tagLine}
            onChange={updateForm("tagLine")}
          ></Input>
        </FormGroup>
        <button className="bg-blue-900 px-6 text-white">Generate</button>
      </form>
      {status === "authenticated" ? (
        <>
          <p>Signed in as {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default GenerateLogo;
