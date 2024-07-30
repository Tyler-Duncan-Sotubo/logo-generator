"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { FormGroup } from "@/components/FormGroup";
import { Button } from "@/components/Button";
import { colorPatterns, industries, styles } from "@/data/data";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { useBuyCredits } from "@/hooks/useBuyCredits";

const CreateLogo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prompt: "",
    letterOne: "",
    letterTwo: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedFontStyle, setSelectedFontStyle] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { buyCredits } = useBuyCredits({ price: "1.99" });

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
      if (!data) return;
      router.push(`/my-logos`);
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
    if (!selectedFontStyle) {
      newErrors.push("Please select a style");
    }
    if (!selectedPattern) {
      newErrors.push("Please select a color pattern");
    }
    if (!selectedIndustry) {
      newErrors.push("Please select an industry");
    }
    setFormErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkData = {
      ...formData,
      colors: selectedPattern,
      industry: selectedIndustry,
      fontStyle: selectedFontStyle,
    };

    const isValid = validateForm();

    if (isValid) {
      generateLogo.mutate(checkData);
    }

    setFormData({
      prompt: "",
      letterOne: "",
      letterTwo: "",
    });
  };

  useEffect(() => {
    if (generateLogo.isPending) {
      setShowModal(true);
    }
  }, [generateLogo.isPending]);

  return (
    <div className="min-h-screen">
      <h1 className="my-6 text-6xl font-medium">Generate Your Logo</h1>
      <form onSubmit={handleSubmit}>
        {/* Logo Name and Slogan */}
        <div className="my-8">
          <h2 className="my-3 text-2xl">
            Here are some tips to make better Logos:
          </h2>
          <ul className="list-disc px-10 text-xl">
            <li>Describe your logo idea with a simple phrase</li>
            <li>Pick 1 Letter and 1 Word to represent you logo</li>
          </ul>
        </div>
        <div className="mb-6 flex flex-col gap-10 md:flex-row">
          <FormGroup>
            <Label htmlFor={formData.prompt}>Describe your logo idea</Label>
            <Input
              value={formData.prompt}
              onChange={updateForm("prompt")}
              placeholder="A fast moving car"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor={formData.letterOne}>Add a Word (Optional)</Label>
            <Input
              value={formData.letterOne}
              onChange={updateForm("letterOne")}
              placeholder="Car"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor={formData.letterTwo}>Add a Letter(Optional)</Label>
            <Input
              value={formData.letterTwo}
              onChange={updateForm("letterTwo")}
              placeholder="F"
            ></Input>
          </FormGroup>
        </div>
        {/* Colors */}
        <div className="my-14">
          <Label>Select a Color Pattern</Label>
          <div className="mt-2 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(colorPatterns).map(
              ([patternName, patternColors], index) => (
                <div
                  key={index}
                  className={`min-h-60 transform cursor-pointer rounded-md shadow-md transition-transform ${
                    selectedPattern === patternColors
                      ? "scale-105 border-4 border-blue-950"
                      : ""
                  }`}
                  onClick={() => setSelectedPattern(patternColors)}
                >
                  <div className="flex">
                    {patternColors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="h-48 w-1/3"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <h2 className="py-4 text-center text-2xl font-semibold">
                    {patternName.charAt(0).toUpperCase() + patternName.slice(1)}
                  </h2>
                </div>
              ),
            )}
          </div>
        </div>
        {/* Industry */}
        <div className="my-20">
          <h1 className="mb-4 text-2xl font-bold">Select an Industry:</h1>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className={`flex h-32 transform cursor-pointer flex-col items-center justify-center gap-6 space-x-2 rounded-md p-4 text-gray-600 shadow-md transition-transform ${
                  selectedIndustry === industry.name
                    ? "scale-105 border-4 border-indigo-500 bg-indigo-100"
                    : "bg-white"
                }`}
                onClick={() => setSelectedIndustry(industry.name)}
              >
                {industry.icon}
                <span className="text-lg font-semibold">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Font Style */}
        <div className="my-20">
          <h1 className="mb-4 text-2xl font-bold">Select font styles:</h1>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {styles.map((style) => (
              <div
                key={style.name}
                className={`flex h-40 transform cursor-pointer flex-col items-center justify-center gap-6 space-x-2 rounded-md p-4 text-gray-600 shadow-md transition-transform ${
                  selectedFontStyle === style.name
                    ? "scale-105 border-4 border-indigo-500 bg-indigo-100"
                    : "bg-white"
                }`}
                style={{ fontFamily: style.font }}
                onClick={() => setSelectedFontStyle(style.name)}
              >
                <span className="text-lg font-semibold capitalize">
                  {style.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button>Generate </Button>

        <p className="my-10 text-xl text-green-800">
          One Credit per Logo Generated
        </p>
      </form>

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
      {generateLogo.error && (
        <ul className="mt-4 list-disc rounded-md bg-red-100 px-10 py-4 text-red-800">
          {generateLogo.error.message === "UNAUTHORIZED" ? (
            <p>Please login to continue</p>
          ) : (
            <div>
              {generateLogo.error.message === "no credit" ? (
                <div className="flex items-center gap-10">
                  <p>You have no credit to generate Logo</p>
                  <Button onClick={() => buyCredits().catch(console.error)}>
                    Buy Credit To Continue
                  </Button>
                </div>
              ) : (
                generateLogo.error.message
              )}
            </div>
          )}
        </ul>
      )}
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

export default CreateLogo;
