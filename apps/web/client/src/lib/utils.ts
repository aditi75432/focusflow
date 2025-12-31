import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const htmlToPlainText = (html: string): string => {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  return temp.textContent || temp.innerText || "";
};

export const urlToFileName = (url: string, maxLength = 50) => {
  const lastPart = url.split("/").pop() || "";
  let fileName = lastPart.replace(/^\d+-/, "");

  if (fileName.length > maxLength) {
    const start = fileName.slice(0, 25);
    const end = fileName.slice(-22);
    fileName = `${start}...${end}`;
  }

  return fileName;
};
