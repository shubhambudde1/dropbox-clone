"use client";

import { useUser, useClerk } from "@clerk/nextjs";
// Replaced HeroUI Card, Spinner, Avatar, Divider with plain HTML + Tailwind
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, Shield, ArrowRight } from "lucide-react";

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <div className="h-8 w-8 rounded-full border-4 border-t-primary border-default-200 animate-spin" />
        <p className="mt-4 text-default-600">Loading your profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
  return (
    <div className="max-w-md mx-auto border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow rounded-md overflow-hidden">
      <div className="flex gap-3 items-center px-4 py-3">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">User Profile</h2>
      </div>
      <div className="border-t border-default-200" />
      <div className="text-center py-10 px-4">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-default-100 flex items-center justify-center text-lg text-default-700">
            Guest
          </div>
          <p className="text-lg font-medium">Not Signed In</p>
          <p className="text-default-500 mt-2">Please sign in to access your profile</p>
        </div>
        <button
          className="px-8 py-2 rounded bg-primary text-white"
          onClick={() => router.push("/sign-in")}
        >
          <span className="mr-2">Sign In</span>
          <ArrowRight className="h-4 w-4 inline" />
        </button>
      </div>
    </div>
  );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.primaryEmailAddress?.emailAddress || "";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const userRole = user.publicMetadata.role as string | undefined;

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  return (
    <div className="max-w-md mx-auto border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow rounded-md overflow-hidden">
      <div className="flex gap-3 items-center px-4 py-3">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">User Profile</h2>
      </div>
      <div className="border-t border-default-200" />
      <div className="py-6 px-4">
        <div className="flex flex-col items-center text-center mb-6">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={fullName}
              className="mb-4 h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mb-4 h-24 w-24 rounded-full bg-default-100 flex items-center justify-center text-lg">
              {initials}
            </div>
          )}
          <h3 className="text-xl font-semibold">{fullName}</h3>
          {user.emailAddresses && user.emailAddresses.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-default-500">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
          {userRole && (
            <Badge color="primary" variant="flat" className="mt-3" aria-label={`User role: ${userRole}`}>
              {userRole}
            </Badge>
          )}
        </div>

        <div className="my-4 border-t border-default-200" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Account Status</span>
            </div>
            <Badge color="success" variant="flat" aria-label="Account status: Active">
              Active
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary/70" />
              <span className="font-medium">Email Verification</span>
            </div>
            <Badge
              color={
                user.emailAddresses?.[0]?.verification?.status === "verified" ? "success" : "warning"
              }
              variant="flat"
              aria-label={`Email verification status: ${
                user.emailAddresses?.[0]?.verification?.status === "verified" ? "Verified" : "Pending"
              }`}
            >
              {user.emailAddresses?.[0]?.verification?.status === "verified" ? "Verified" : "Pending"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="border-t border-default-200 px-4 py-3 flex justify-between">
        <button
          className="px-4 py-2 rounded bg-red-50 text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 inline mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
