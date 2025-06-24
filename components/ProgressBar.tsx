"use client";
import React from "react";

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-indigo-800 rounded-lg h-4 mt-2">
      <div
        className="bg-gradient-to-r from-sky-400 to-fuchsia-500 h-4 rounded-lg transition-all duration-300"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
