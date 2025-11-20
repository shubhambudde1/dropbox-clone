"use client";

// Replaced HeroUI Spinner with plain Tailwind spinner

export default function FileLoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="h-8 w-8 rounded-full border-4 border-t-primary border-default-200 animate-spin" />
      <p className="mt-4 text-default-600">Loading your files...</p>
    </div>
  );
}
