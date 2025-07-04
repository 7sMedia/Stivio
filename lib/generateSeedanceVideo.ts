// /lib/generateSeedanceVideo.ts

export async function generateSeedanceVideo({
  fileBuffer,
  fileName,
  prompt,
  videoLength = 5,
}: {
  fileBuffer: Buffer,
  fileName: string,
  prompt: string,
  videoLength?: number,
}) {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("video_length", videoLength.toString());
  formData.append("image", new Blob([fileBuffer]), fileName);

  const res = await fetch("https://wavespeed.ai/api/v1/seedance/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.SEEDANCE_API_KEY}`,
    },
    body: formData as any,
  });

  if (!res.ok) {
    return {
      status: "error",
      error: await res.text(),
      video_url: null,
    };
  }
  const data = await res.json();
  return {
    status: data.status || "success",
    video_url: data.video_url || null,
    error: data.error || null,
  };
}
