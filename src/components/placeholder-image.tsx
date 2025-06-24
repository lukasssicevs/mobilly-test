"use client";

interface PlaceholderImageProps {
  type: "album" | "artist";
  className?: string;
}

export function PlaceholderImage({
  type,
  className = "",
}: PlaceholderImageProps) {
  const getPlaceholderColor = () => {
    switch (type) {
      case "album":
        return "bg-gradient-to-br from-purple-400 to-pink-400";
      case "artist":
        return "bg-gradient-to-br from-blue-400 to-cyan-400";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "album":
        return (
          <svg
            className="w-12 h-12 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "artist":
        return (
          <svg
            className="w-12 h-12 text-white/80"
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
      className={`w-full h-48 flex items-center justify-center ${getPlaceholderColor()} ${className}`}
    >
      {getIcon()}
    </div>
  );
}
