// /app/ai-tool/promptTemplates.ts

export const PROMPT_TEMPLATES = [
  // Animation only (no text overlay)
  {
    type: "animation",
    title: "Epic Cinematic Zoom",
    prompt:
      "Animate a slow cinematic zoom-in with depth of field and soft lighting. No text overlay.",
    description: "Classic Instagram story effect for portraits or products.",
  },
  {
    type: "animation",
    title: "Landscape Motion",
    prompt:
      "Bring this landscape to life: animate the clouds, add drifting mist, make the sunlight shimmer. No text overlay.",
    description: "For travel or outdoor photos.",
  },
  {
    type: "animation",
    title: "Classic Parallax",
    prompt:
      "Create a 2.5D parallax effect by separating foreground and background, adding subtle camera movement. No text overlay.",
    description: "Makes flat images pop.",
  },
  // With text overlay (uses {text} placeholder for advanced editing)
  {
    type: "text",
    title: "Motivational Overlay",
    prompt:
      "Add bold, modern text at the bottom center: '{text}'. Animate a gentle camera pan and bright lighting.",
    description: "Perfect for reels with quotes.",
  },
  {
    type: "text",
    title: "Personal Caption",
    prompt:
      "Add the text: '{text}' in clean white font at the top. Animate background blur and soft motion.",
    description: "For inspirational video posts.",
  },
  {
    type: "text",
    title: "Branded Outro",
    prompt:
      "Animate a cinematic fade-in with your brand name '{text}' in the lower right corner in small text. Use a dynamic camera zoom.",
    description: "For ending or watermarking your clips.",
  },
];
