"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="text-stone-400 hover:text-stone-600 transition text-sm"
    >
      &larr; Back
    </button>
  );
}
