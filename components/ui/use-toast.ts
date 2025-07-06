import { useToast as useRadixToast } from "@radix-ui/react-toast";

export function useToast() {
  const { toast, ...rest } = useRadixToast();

  return {
    toast,
    ...rest,
  };
}
