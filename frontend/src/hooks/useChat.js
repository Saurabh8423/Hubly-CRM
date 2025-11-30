import { useContext } from "react";
import { useChatContext } from "../context/ChatContext";

export default function useChat() {
  return useContext(useChatContext());
}
