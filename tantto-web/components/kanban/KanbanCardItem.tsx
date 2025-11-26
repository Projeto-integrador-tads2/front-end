import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import type { KanbanCard } from "@/types/kanban";
import { useState } from "react";

export type KanbanCardItemProps = {
  /** The card data to display */
  card: KanbanCard;
  /** Callback when edit button is clicked */
  onEdit?: (card: KanbanCard) => void;
  /** Callback when delete button is clicked */
  onDelete?: (cardId: string) => void;
  /** Whether actions are disabled */
  disabled?: boolean;
};

/**
 * Priority color configurations.
 * Maps priority levels to background and text colors.
 */
const priorityColors = {
  "Alta Prioridade": {
    bg: "bg-[#EDF4FF]",
    text: "text-[#2563EB]",
  },
  "Média Prioridade": {
    bg: "bg-[#FFF8E1]",
    text: "text-[#F59E42]",
  },
  "Baixa Prioridade": {
    bg: "bg-[#E6F9F0]",
    text: "text-[#22C55E]",
  },
} as const;

export function KanbanCardItem({
  card,
  onEdit,
  onDelete,
  disabled = false,
}: KanbanCardItemProps) {
  const [showActions, setShowActions] = useState(false);
  const colors = priorityColors[card.priority] || priorityColors["Média Prioridade"];

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.(card);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Tem certeza que deseja excluir este card?")) {
      onDelete?.(card.id);
    }
  };

  /**
   * Prevents drag from starting when interacting with action buttons.
   * This is necessary because the parent KanbanCard component has drag listeners.
   */
  const preventDrag = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative flex flex-col gap-2 rounded-2xl min-h-[92px] group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Action buttons - appear on hover */}
      {(onEdit || onDelete) && (
        <div
          className={cn(
            "absolute top-0 right-0 flex gap-1 transition-opacity duration-200 z-10",
            showActions ? "opacity-100" : "opacity-0"
          )}
          onPointerDown={preventDrag}
          onMouseDown={preventDrag}
        >
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg bg-[#292C36] hover:bg-[#363A46] text-[#A3A6B1] hover:text-white"
              onClick={handleEdit}
              onPointerDown={preventDrag}
              onMouseDown={preventDrag}
              disabled={disabled}
              title="Editar card"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg bg-[#292C36] hover:bg-red-500/20 text-[#A3A6B1] hover:text-red-500"
              onClick={handleDelete}
              onPointerDown={preventDrag}
              onMouseDown={preventDrag}
              disabled={disabled}
              title="Excluir card"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Priority Badge */}
      <div className="flex items-center gap-2 mb-1">
        <Badge
          className={cn(
            "rounded-full px-3 py-0.5 text-[12px] font-bold border-0",
            colors.bg,
            colors.text
          )}
          style={{
            minWidth: 98,
            textAlign: "center",
            letterSpacing: 0.01,
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.04)",
          }}
        >
          {card.priority}
        </Badge>
      </div>

      {/* Card Title */}
      <div className="font-bold text-[16px] text-white leading-tight mb-0.5 pr-16">
        {card.title || card.companyName || "Sem título"}
      </div>

      {/* Card Description */}
      <div className="text-[13px] text-[#A3A6B1] mb-2 line-clamp-2">
        {card.description || `Empresa: ${card.companyName || "N/A"}`}
      </div>

      {/* User Info / Avatars */}
      {(card.userName || (card.avatars && card.avatars.length > 0)) && (
        <div className="flex items-center gap-2 mt-auto">
          {card.avatars && card.avatars.length > 0 ? (
            <>
              {card.avatars.slice(0, 3).map((src, i) => (
                <Avatar
                  key={i}
                  className="w-8 h-8 border-2 border-white -ml-2 first:ml-0 shadow-sm"
                >
                  <AvatarImage src={src} />
                  <AvatarFallback>
                    {card.userName?.charAt(0).toUpperCase() || "+"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {card.avatars.length > 3 && (
                <span className="ml-1 text-xs bg-[#23262F] px-2 py-0.5 rounded-full text-[#A3A6B1] font-medium border border-[#292C36]">
                  +{card.avatars.length - 3}
                </span>
              )}
            </>
          ) : card.userName ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6 border border-[#292C36]">
                <AvatarFallback className="bg-[#292C36] text-[10px] text-white">
                  {card.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-[#A3A6B1]">{card.userName}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
