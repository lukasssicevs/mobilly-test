"use client";

import { SpotifyItem, ContentType, TYPE_GRADIENTS } from "@/types";
import { capitalize } from "@/utils";
import { TypeIcon } from "./icons";

interface ItemSectionProps {
  title: string;
  items: SpotifyItem[];
  type: ContentType;
  children: (item: SpotifyItem) => React.ReactNode;
}

export const ItemSection = ({
  title,
  items,
  type,
  children,
}: ItemSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${TYPE_GRADIENTS[type]}`}
        >
          <TypeIcon type={type} />
        </div>
        <h3 className="text-lg font-semibold text-white">
          {capitalize(title)} ({items.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(children)}
      </div>
    </div>
  );
};
