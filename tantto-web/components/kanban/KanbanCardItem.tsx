import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Trash2, TrendingUp } from "lucide-react";
import type { KanbanCard } from "@/types/kanban";
import { useState } from "react";
import { predictCompanyCard } from "@/services/kanban";
import { toast } from "sonner";

export type KanbanCardItemProps = {
  card: KanbanCard;
  onEdit?: (card: KanbanCard) => void;
  onDelete?: (cardId: string) => void;
  disabled?: boolean;
};

const priorityColors = {
  "Alta Prioridade": { bg: "bg-[#EDF4FF]", text: "text-[#2563EB]" },
  "Média Prioridade": { bg: "bg-[#FFF8E1]", text: "text-[#F59E42]" },
  "Baixa Prioridade": { bg: "bg-[#E6F9F0]", text: "text-[#22C55E]" },
} as const;

export function KanbanCardItem({
  card,
  onEdit,
  onDelete,
  disabled = false,
}: KanbanCardItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const colors = priorityColors[card.priority] || priorityColors["Média Prioridade"];

  const stopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  const handlePredict = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPredicting) return;

    setIsPredicting(true);

    try {
      const result = await predictCompanyCard(card.id);

      const predictionMessages = {
        "Muito Provável": {
          title: "Muito Provável",
          description: "Esta empresa tem alta probabilidade de fechamento!",
          color: "success"
        },
        "Provável": {
          title: "Provável",
          description: "Esta empresa tem boa probabilidade de fechamento.",
          color: "info"
        },
        "Pouco Provável": {
          title: "Pouco Provável",
          description: "Esta empresa tem baixa probabilidade de fechamento.",
          color: "warning"
        }
      };

      const message = predictionMessages[result.result];

      toast.success(message.title, {
        description: message.description,
        duration: 5000,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Erro ao Prever", {
        description: "Não foi possível obter a previsão. Tente novamente.",
        duration: 4000,
      });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div
      className="relative flex flex-col gap-2 rounded-2xl min-h-[92px] group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Botões de Ação (Editar / Excluir) */}
      {(onEdit || onDelete) && (
        <div
          className={cn(
            "absolute top-0 right-0 flex gap-1 transition-opacity duration-200 z-10",
            showActions ? "opacity-100" : "opacity-0"
          )}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
          onClick={stopPropagation} // Garante que o clique não vaze
        >
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg bg-[#292C36] hover:bg-[#363A46] text-[#A3A6B1] hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              disabled={disabled}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg bg-[#292C36] hover:bg-red-500/20 text-[#A3A6B1] hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id); // Apenas avisa o pai
              }}
              disabled={disabled}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Badge de Prioridade */}
      <div className="flex items-center gap-2 mb-1">
        <Badge
          className={cn(
            "rounded-full px-3 py-0.5 text-[12px] font-bold border-0",
            colors.bg,
            colors.text
          )}
          style={{ minWidth: 98, textAlign: "center", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.04)" }}
        >
          {card.priority}
        </Badge>
      </div>

      {/* Título e Descrição */}
      <div className="font-bold text-[16px] text-white leading-tight mb-0.5 pr-16">
        {card.title || card.companyName || "Sem título"}
      </div>
      <div className="text-[13px] text-[#A3A6B1] mb-2 line-clamp-2">
        {card.description || `Empresa: ${card.companyName || "N/A"}`}
      </div>

      {/* Avatares */}
      {(card.userName || (card.avatars && card.avatars.length > 0)) && (
        <div className="flex items-center gap-2 mt-auto">
          {card.avatars?.length ? (
            <>
              {card.avatars.slice(0, 3).map((src, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white -ml-2 first:ml-0 shadow-sm">
                  <AvatarImage src={src} />
                  <AvatarFallback>{card.userName?.charAt(0).toUpperCase()}</AvatarFallback>
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

      {/* Botão de Previsão de Fechamento */}
      <div className="mt-3 pt-2 border-t border-[#292C36]">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white border-0 rounded-lg shadow-sm transition-all duration-200"
          onClick={handlePredict}
          disabled={disabled || isPredicting}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          {isPredicting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Prevendo...
            </>
          ) : (
            <>
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Previsão de Fechamento
            </>
          )}
        </Button>
      </div>
    </div>
  );
}