"use client";
import { useState } from "react";
import { KanbanProvider, KanbanBoard, KanbanCards, KanbanCard } from "@/components/kibo-ui/kanban";
import { useKanbanData } from "@/components/kanban/useKanbanData";
import { KanbanCardDialog } from "@/components/kanban/KanbanCardDialog";
import { KanbanColumnDialog } from "@/components/kanban/KanbanColumnDialog";
import { KanbanCardItem } from "@/components/kanban/KanbanCardItem";
import { KanbanColumnHeader } from "@/components/kanban/KanbanColumnHeader";
import { Button } from "@/components/ui/button";

export default function EmpresasKanbanPage() {
  const { columns, cards, addCard, addColumn } = useKanbanData();
  const [openCardDialog, setOpenCardDialog] = useState<string | null>(null);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background px-0 py-0">
      <div>
        <div className="bg-sidebar flex items-center justify-between mb-3 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Kanban Tantto</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-[#A3A6B1]">Por Status:</span>
              <Button size="sm" className="bg-[#23262F] text-white rounded-full px-4 py-1 h-7 text-xs font-semibold border border-[#3B82F6] flex items-center gap-2">
                Todas Tasks
                <span className="ml-2 bg-[#22C55E] text-white rounded-full px-2 py-0.5 text-xs font-bold">12</span>
              </Button>
            </div>
          </div>
          <Button
            className="bg-primary text-white font-bold rounded-full! px-7 py-2 text-[16px] hover:bg-[#16a34a] border-0"
            onClick={() => setOpenColumnDialog(true)}
          >
            Adicionar Coluna
          </Button>
        </div>
        <div className="px-4 py-6">
          <div className="w-full overflow-x-auto">
            <KanbanProvider columns={columns} data={cards}>
              {(column) => (
                <KanbanBoard key={column.id} id={column.id} className="min-w-[340px] max-w-sm">
                  <KanbanColumnHeader
                    column={column}
                    onAddCard={() => setOpenCardDialog(column.id)}
                  />
                  <KanbanCards id={column.id} className="min-h-[120px]">
                    {(item) => (
                      <KanbanCard key={item.id} {...item}>
                        <KanbanCardItem card={item as import("@/components/kanban/useKanbanData").KanbanCard} />
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              )}
            </KanbanProvider>
          </div>
        </div>
      </div>
      {/* Dialogs */}
      <KanbanCardDialog
        open={!!openCardDialog}
        onOpenChange={(open) => setOpenCardDialog(open ? openCardDialog : null)}
        onSubmit={(data) => {
          addCard.mutate({
            ...data,
            name: data.title,
            column: data.columnId,
            avatars: ["/avatars/1.png"],
            description: data.description || "",
          });
        }}
        columnId={openCardDialog || ""}
      />
      <KanbanColumnDialog
        open={openColumnDialog}
        onOpenChange={setOpenColumnDialog}
        onSubmit={(data) => {
          addColumn.mutate(data);
        }}
      />
    </div>
  );
}
