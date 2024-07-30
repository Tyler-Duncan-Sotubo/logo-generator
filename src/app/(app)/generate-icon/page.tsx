"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { FormGroup } from "@/components/FormGroup";
import { Button } from "@/components/Button";
import { colors, iconStyles, backgrounds } from "@/data/data";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";
import Link from "next/link";

const CreateIcon = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prompt: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const updateForm = (key: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  };

  const generateIcon = api.generateIcon.generateIcon.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      router.push(`/my-icons`);
    },
    onError: () => {
      setShowModal(false);
    },
  });

  const validateForm = () => {
    const newErrors = [];
    if (!formData.prompt) {
      newErrors.push("Please enter a prompt");
    }
    if (!selectedStyle) {
      newErrors.push("Please select a style");
    }
    if (!selectedColor) {
      newErrors.push("Please select a color");
    }
    setFormErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkData = {
      ...formData,
      fontStyle: selectedStyle,
      color: selectedColor,
      background: selectedBackground,
    };

    const isValid = validateForm();

    if (isValid) {
      generateIcon.mutate(checkData);
    }

    setFormData({
      prompt: "",
    });
  };

  useEffect(() => {
    generateIcon.isPending && setShowModal(true);
  }, [generateIcon.isPending]);

  return (
    <div className="min-h-screen">
      {/* { generateIcon.error && <p>{ generateIcon.error.message}</p>} */}
      <h1 className="my-6 text-6xl font-medium">
        Let&rsquo;s Generate Your Icon
      </h1>
      <form onSubmit={handleSubmit}>
        <FormGroup className="my-14">
          <Label htmlFor={formData.prompt}>
            Your icon in a well defined Phrase
          </Label>
          <Input
            value={formData.prompt}
            onChange={updateForm("prompt")}
            placeholder="A happy dog running in the park"
          ></Input>
        </FormGroup>

        {/* Font Style */}
        <div className="my-20 lg:w-1/2">
          <h3 className="my-10 text-2xl font-bold">Select an Icon Style</h3>
          <div className="mt-2 grid grid-cols-3 gap-10 md:grid-cols-5 lg:grid-cols-5">
            {iconStyles.map((style, index) => (
              <div
                key={index}
                className={`flex w-full transform cursor-pointer flex-col items-center gap-3 rounded-md transition-transform ${
                  selectedStyle === style.name
                    ? "scale-125 duration-500"
                    : "hover:opacity-40"
                }`}
                onClick={() => setSelectedStyle(style.name)}
              >
                <Image
                  src={style.url}
                  alt={style.name}
                  width={512}
                  height={512}
                  className="rounded-full shadow-2xl"
                />
                <div>
                  <span className="text-center text-lg font-medium">
                    {style.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="my-20 lg:w-1/2">
          <h3 className="my-10 text-2xl font-bold">Select a Color</h3>
          <div className="mt-2 grid grid-cols-4 gap-10 md:grid-cols-6 lg:grid-cols-6">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`transform cursor-pointer transition-transform ${
                  selectedColor === color ? "scale-125" : "hover:opacity-35"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <div
                  className="h-20 w-20 rounded-full shadow-md"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Background */}
        <div className="my-20 lg:w-1/2">
          <h3 className="my-10 text-2xl font-bold">
            Select a Background (Optional)
          </h3>
          <div className="mt-2 grid grid-cols-3 gap-10 md:grid-cols-2 lg:grid-cols-6">
            {backgrounds.map((color, index) => (
              <div
                key={index}
                className={`transform cursor-pointer transition-transform ${
                  selectedBackground === color
                    ? "scale-125"
                    : "hover:opacity-35"
                }`}
                onClick={() => setSelectedBackground(color)}
              >
                <div
                  className="h-20 w-20 rounded-md shadow-md"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button>Generate</Button>

        <p className="my-10 text-xl text-green-800">
          One Credit per Logo Generated
        </p>

        {/* Error Messages */}
        {formErrors.length > 0 && (
          <ul className="mt-4 list-disc rounded-md bg-red-100 px-10 py-4 text-red-800">
            {formErrors.map((error, index) => (
              <li key={index} className="text-lg">
                {error}
              </li>
            ))}
          </ul>
        )}

        {/* Server Error */}
        {generateIcon.error && (
          <ul className="mt-4 list-disc rounded-md bg-red-100 px-10 py-4 text-red-800">
            {generateIcon.error.message === "UNAUTHORIZED" ? (
              <p>Please login to continue</p>
            ) : (
              <p>
                {generateIcon.error.message === "no credit" ? (
                  <div className="flex items-center gap-10">
                    <p>You have no credit to generate icon</p>
                    <Link href="/buy-credit">
                      <Button>Buy Credit To Continue</Button>
                    </Link>
                  </div>
                ) : (
                  generateIcon.error.message
                )}
              </p>
            )}
          </ul>
        )}
      </form>
      {showModal && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex h-[30%] w-[80%] flex-col items-center justify-center">
            <Spinner />
          </div>
        </section>
      )}
    </div>
  );
};

export default CreateIcon;
