import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchDropboxFolders(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("dropbox_folder")
    .eq("user_id", userId);

  if (error) throw new Error("Failed to fetch Dropbox folders");

  const folderList = data?.map((entry) => entry.dropbox_folder) || [];

  return [...new Set(folderList.filter(Boolean))]; // dedupe and exclude nulls
}
