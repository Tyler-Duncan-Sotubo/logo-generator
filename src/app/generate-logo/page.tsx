"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/Input";
import { FormGroup } from "@/components/FormGroup";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useBuyCredits } from "@/hooks/useBuyCredits";

const GenerateLogo = () => {
  const { buyCredits } = useBuyCredits();
  const [formData, setFormData] = useState({
    logoName: "",
    tagLine: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");

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
    onSuccess: (data) => {
      if (!data.imageUrl) return;
      setImageUrl(data.imageUrl);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateLogo.mutate(formData);
    setFormData({
      logoName: "",
      tagLine: "",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <h1 className="my-20 text-6xl">Generate Logo</h1>
      {status === "authenticated" && (
        <button
          onClick={() => buyCredits().catch(console.error)}
          className="my-10 bg-blue-900 px-6 text-white"
        >
          Buy Credit
        </button>
      )}
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
      <Image src={imageUrl} alt="Generated Logo" width={500} height={500} />
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
