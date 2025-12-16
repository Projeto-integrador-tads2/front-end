import type { KanbanColumn } from "@/types/kanban";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";


const fallbackColors: Record<string, { bg: string; icon: string }> = {
  "Análise de Perfil": { bg: "bg-chart-2", icon: "text-chart-2" },
  "Conversa com o Cliente": { bg: "bg-chart-1", icon: "text-chart-1" },
  "Negociação": { bg: "bg-primary", icon: "text-primary" },
  "Fechamento": { bg: "bg-green-500", icon: "text-green-500" },
  "Perdido": { bg: "bg-red-500", icon: "text-red-500" },
};

export type KanbanColumnHeaderProps = {
  column: KanbanColumn;
  onAddCard: () => void;
  onEditColumn?: (column: KanbanColumn) => void;
  disabled?: boolean;
};

export function KanbanColumnHeader({
  column,
  onAddCard,
  onEditColumn,
  disabled = false,
}: KanbanColumnHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const cardCount = column.cards?.length ?? 0;
  const fallback = fallbackColors[column.name];

  const handleEditColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEditColumn?.(column);
  };


  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-2 pt-2 pb-2 rounded-full shadow-md m-3",
        fallback?.bg || "bg-accent"
      )}
      style={column.color ? { backgroundColor: column.color } : undefined}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex items-center justify-center rounded-3xl text-[15px] font-bold shadow-sm w-12 h-9 bg-white",
            fallback?.icon || "text-accent"
          )}
          style={column.color ? { color: column.color } : undefined}
        >
          {cardCount}
        </span>
        <span className="font-bold text-[16px] px-3 py-1 rounded-xl text-white bg-transparent font-jakarta-sans">
          {column.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {onEditColumn && (
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "rounded-full w-8 h-8 bg-white/10 hover:bg-white/20 border-0 shadow-sm flex items-center justify-center p-0 text-white"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              disabled={disabled}
              type="button"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-50 bg-[#23262F] rounded-lg shadow-lg border border-[#292C36] py-1 min-w-[120px]"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#292C36] transition-colors"
                  onClick={handleEditColumn}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
              </div>
            )}
          </div>
        )}

        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "rounded-full w-8 h-8 bg-white hover:bg-muted border-0 shadow-sm flex items-center justify-center p-0",
            fallback?.icon || "text-accent"
          )}
          style={column.color ? { color: column.color } : undefined}
          onClick={onAddCard}
          disabled={disabled}
          type="button"
          title="Adicionar card"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}