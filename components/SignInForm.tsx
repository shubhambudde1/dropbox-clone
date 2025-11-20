"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
// Replaced HeroUI Card, Input and Button with plain HTML + Tailwind
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Sign-in incomplete:", result);
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl rounded-md overflow-hidden">
      <div className="flex flex-col gap-1 items-center pb-2 px-4 pt-4">
        <h1 className="text-2xl font-bold text-default-900">Welcome Back</h1>
        <p className="text-default-500 text-center">Sign in to access your secure cloud storage</p>
      </div>

      <div className="border-t border-default-200" />

      <div className="py-6 px-4">
        {authError && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="identifier" className="text-sm font-medium text-default-900">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500">
                <Mail className="h-4 w-4" />
              </div>
              <input id="identifier" type="email" placeholder="your.email@example.com" {...register("identifier")} className="w-full border border-default-200 rounded pl-10 pr-3 py-2" />
              {errors.identifier && <p className="text-sm text-red-600 mt-1">{errors.identifier.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-default-900">Password</label>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500">
                <Lock className="h-4 w-4" />
              </div>
              <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} className="w-full border border-default-200 rounded pl-10 pr-10 py-2" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-default-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button type="submit" className="w-full px-4 py-2 rounded bg-primary text-white">{isSubmitting ? "Signing in..." : "Sign In"}</button>
        </form>
      </div>

      <div className="border-t border-default-200 px-4 py-4 text-center">
        <p className="text-sm text-default-600">Don't have an account?{' '}<Link href="/sign-up" className="text-primary hover:underline font-medium">Sign up</Link></p>
      </div>
    </div>
  );
}
