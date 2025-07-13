import { create } from 'zustand';

interface PromptInputState {
  prompt: string;
  setPrompt: (newPrompt: string) => void;
}

export const usePromptInput = create<PromptInputState>((set) => ({
  prompt: '',
  setPrompt: (newPrompt: string) => set({ prompt: newPrompt }),
}));
