import { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    // Only redirect if they're trying to visit a protected route
    redirect("/"); // ✅ send them to landing page
  }

  return <>{children}</>;
}
