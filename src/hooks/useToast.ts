import { useCallback, useState } from "react";

export interface ToastMessage {
  id: string;
  text: string;
}

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const push = useCallback((text: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setMessages((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setMessages((prev) => prev.filter((item) => item.id !== id));
    }, 2500);
  }, []);

  return { messages, push };
}
