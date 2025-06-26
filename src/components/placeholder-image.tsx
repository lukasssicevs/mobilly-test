"use client";

interface PlaceholderImageProps {
  type: "album" | "artist" | "track";
  className?: string;
}

export function PlaceholderImage({
  type,
  className = "",
}: PlaceholderImageProps) {
  const getPlaceholderColor = () => {
    switch (type) {
      case "track":
        return "bg-gradient-to-br from-green-600 to-green-500";
      case "album":
        return "bg-gradient-to-br from-purple-600 to-purple-500";
      case "artist":
        return "bg-gradient-to-br from-blue-600 to-blue-500";
      default:
        return "bg-gradient-to-br from-gray-600 to-gray-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "track":
        return (
          <svg
            className="w-16 h-16 text-white/80 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        );
      case "album":
        return (
          <svg
            className="w-16 h-16 text-white/80 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
        );
      case "artist":
        return (
          <svg
            className="w-16 h-16 text-white/80 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${getPlaceholderColor()} ${className}`}
    >
      {getIcon()}
    </div>
  );
}
