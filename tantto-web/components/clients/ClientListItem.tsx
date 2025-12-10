"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import type { Client } from "@/types/client";

export type ClientListItemProps = {
  /** The client data to display */
  client: Client;
  /** Callback when the item is clicked */
  onClick?: (client: Client) => void;
  /** Whether this item is expanded/selected */
  isExpanded?: boolean;
};

/**
 * Gets initials from a name string.
 */
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * A single client item in the list.
 * Displays avatar, name, and an expandable chevron.
 */
export function ClientListItem({
  client,
  onClick,
  isExpanded = false,
}: ClientListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(client)}
      className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={client.name} />
          <AvatarFallback className="bg-card text-white font-semibold text-sm">
            {getInitials(client.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-white font-medium">{client.name}</span>
      </div>
      <ChevronDown
        size={20}
        className={`text-white/70 transition-transform ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
