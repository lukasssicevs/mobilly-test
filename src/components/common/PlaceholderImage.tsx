"use client";

import { ContentType, TYPE_GRADIENTS } from "@/types";
import { TypeIcon } from "./icons";

interface PlaceholderImageProps {
  type: ContentType;
  className?: string;
}

export function PlaceholderImage({
  type,
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${TYPE_GRADIENTS[type]} ${className}`}
    >
      <TypeIcon type={type} className="w-16 h-16 text-white/80 flex-shrink-0" />
    </div>
  );
}
