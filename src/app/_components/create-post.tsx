"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

// Define the Zod schema for validation
const postSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }) // Minimum length of 3
    .nonempty({ message: "Title is required" }), // Ensure the title is not empty
});

interface FormData {
  name: string;
}

export function CreatePost() {
  // Setup useForm with Zod resolver
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema), // Apply the Zod schema to the form
  });

  const router = useRouter();

  // Handle the createPost mutation
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      reset(); // Reset form fields on success
    },
  });

  const onSubmit = (data: FormData) => {
    createPost.mutate({ name: data.name });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        {...register("name")} // Register with react-hook-form
        className="w-full rounded-lg px-4 py-2 text-black"
      />
      {errors.name && (
        <span className="text-red-500 text-sm">{errors.name.message}</span>
      )}

      <Button
        type="submit"
        className="rounded-lg bg-white/40 px-10 py-4 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}