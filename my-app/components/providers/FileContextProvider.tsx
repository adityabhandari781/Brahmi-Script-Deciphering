'use client'
import { createContext, useContext } from "react";

export const FileContext = createContext<{
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
}>({
  files: null,
  setFiles: () => {},
})

export const FileContextProvider = FileContext.Provider;

export default function useFileContext() {
  return useContext(FileContext);
}
