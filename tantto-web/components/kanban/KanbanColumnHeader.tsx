import { KanbanColumn } from "./useKanbanData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const headerColors: Record<string, { bg: string; icon: string }> = {
  "Análise de Perfil": { bg: "bg-chart-2", icon: "text-chart-2" },
  "Conversa com o Cliente": { bg: "bg-chart-1", icon: "text-chart-1" },
  "Negociação": { bg: "bg-primary", icon: "text-primary" },
};

export function KanbanColumnHeader({ column, onAddCard }: { column: KanbanColumn; onAddCard: () => void }) {
  const count = column.name === "Análise de Perfil" ? 25 : column.name === "Conversa com o Cliente" ? 8 : column.name === "Negociação" ? 2 : 0;
  const color = headerColors[column.name] || { bg: "bg-accent", icon: "text-accent" };

  return (
    <div
      className={`flex items-center justify-between px-2 pt-2 pb-2 rounded-full shadow-md ${color.bg} m-3`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center justify-center  rounded-3xl text-[15px] font-bold shadow-sm w-12 h-9 bg-white ${color.icon}`}
        >
          {count}
        </span>
        <span
          className="font-bold text-[16px] px-3 py-1 rounded-xl text-white bg-transparent font-jakarta-sans"
        >
          {column.name}
        </span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className={`rounded-full w-8 h-8 bg-white hover:bg-muted border-0 shadow-sm flex items-center justify-center p-0 ${color.icon}`}
        onClick={onAddCard}
        type="button"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}
