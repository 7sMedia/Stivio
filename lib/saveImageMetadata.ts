"use server";

import { createClient } from "@supabase/supabase-js";
import { ImageFile } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function saveImageMetadata(userId: string, image: ImageFile) {
  const { error } = await supabase.from("images").insert([
    {
      user_id: userId,
      original_name: image.name,
      dropbox_path: image.dropboxPath,
      modified_name: image.modifiedName || null,
      public_url: image.url,
    },
  ]);

  if (error) {
    console.error("Error saving image metadata to Supabase:", error.message);
  }
}
