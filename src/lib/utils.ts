"""
Computation 
Author: Aishi De, Parthiv Abhani, SIT, Nagpur, 2026
"""
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
