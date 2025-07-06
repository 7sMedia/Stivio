// lib/supabaseHelpers.ts
import { supabase } from "./supabaseClient";

export async function getUserFolders(userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("input_folder, output_folder")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error("Failed to fetch user folder settings");
  }

  return {
    inputFolder: data?.input_folder || null,
    outputFolder: data?.output_folder || null,
  };
}
