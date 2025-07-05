// app/components/ui/ResponsiveContainer.tsx
import { ReactNode } from "react";

export default function ResponsiveContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto px-4">
      {children}
    </div>
  );
}
