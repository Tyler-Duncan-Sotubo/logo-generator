"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { FormGroup } from "@/components/FormGroup";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

const CreateLogo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const updateForm = (key: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.email) {
      newErrors.push("Please enter an email");
    }
    setFormErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkData = {
      email: formData.email,
    };

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setFormData({
      email: "",
    });
  };

  return (
    <div className="min-h-screen">
      <h1 className="my-6 text-6xl font-medium">Request App Data Deletion</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col gap-10 md:flex-row">
          <FormGroup>
            <Label htmlFor={formData.email}>Email</Label>
            <Input
              value={formData.email}
              onChange={updateForm("email")}
              placeholder="example@mail.com"
            ></Input>
          </FormGroup>
        </div>

        {/* Submit Button */}
        <Button>Send Request</Button>
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
    </div>
  );
};

export default CreateLogo;
