import { ReactNode } from "react";

export default function ResponsiveContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-none mx-auto px-4">
      {children}
    </div>
  );
}
