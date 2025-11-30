import { useContext } from "react";
import { useToastContext } from "../context/ToastContext";

export default function useToast() {
  return useContext(useToastContext());
}
