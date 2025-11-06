import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { KanbanCard } from "./useKanbanData";

export function KanbanCardItem({ card }: { card: KanbanCard }) {
  return (
    <div className="relative flex flex-col gap-2 rounded-2xl min-h-[92px]">
      <div className="flex items-center gap-2 mb-1">
        <Badge
          className={cn(
            "rounded-full px-3 py-0.5 text-[12px] font-bold border-0",
            card.priority === "Alta Prioridade" && "bg-[#EDF4FF] text-[#2563EB]",
            card.priority === "Média Prioridade" && "bg-[#FFF8E1] text-[#F59E42]",
            card.priority === "Baixa Prioridade" && "bg-[#E6F9F0] text-[#22C55E]"
          )}
          style={{ minWidth: 98, textAlign: 'center', letterSpacing: 0.01, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}
        >
          {card.priority}
        </Badge>
      </div>
      <div className="font-bold text-[16px] text-white leading-tight mb-0.5">
        {card.title}
      </div>
      <div className="text-[13px] text-[#A3A6B1] mb-2">
        {card.description}
      </div>
      <div className="flex items-center gap-1 mt-auto">
        {card.avatars.map((src, i) => (
          <Avatar key={i} className="w-8 h-8 border-2 border-white -ml-2 first:ml-0 shadow-sm">
            <AvatarImage src={src} />
            <AvatarFallback>+</AvatarFallback>
          </Avatar>
        ))}
        {card.avatars.length > 3 && (
          <span className="ml-1 text-xs bg-[#23262F] px-2 py-0.5 rounded-full text-[#A3A6B1] font-medium border border-[#292C36]">
            +{card.avatars.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
