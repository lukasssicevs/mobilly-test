import { ContentType } from "./content";

// Color mappings for content types
export const TYPE_COLORS = {
  track: "success" as const,
  album: "warning" as const,
  artist: "secondary" as const,
} as const;

// Gradient colors for section headers and placeholders
export const TYPE_GRADIENTS = {
  track: "bg-gradient-to-br from-green-600 to-green-500",
  album: "bg-gradient-to-br from-purple-600 to-purple-500",
  artist: "bg-gradient-to-br from-blue-600 to-blue-500",
} as const;

export type TypeColor = (typeof TYPE_COLORS)[ContentType];
