"use client";

import { useState, useCallback } from "react";

import {
  KanbanProvider,
  KanbanBoard,
  KanbanCards,
  KanbanCard,
  type DragEndEvent,
} from "@/components/kanban/kanban";

import { useKanbanData } from "@/components/kanban/useKanbanData";

import {
  KanbanCardDialog,
  type CardFormValues,
} from "@/components/kanban/KanbanCardDialog";


import { KanbanCardItem } from "@/components/kanban/KanbanCardItem";
import { KanbanColumnHeader } from "@/components/kanban/KanbanColumnHeader";
import { AsyncBoundary } from "@/components/common/AsyncBoundary";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import type {
  KanbanCard as KanbanCardType,
} from "@/types/kanban";

// -----------------------------
// Dialog State Types
// -----------------------------
type CardDialogState = {
  isOpen: boolean;
  columnId: string;
  editCard: KanbanCardType | null;
};


// Tipo para controlar o delete unificado
type DeleteDialogState = {
  isOpen: boolean;
  type: 'card' | 'column' | null;
  id: string | null;
};

// -----------------------------
// Page Component
// -----------------------------
export default function EmpresasKanbanPage() {
  const {
    columns,
    companies,
    allCards,
    totalCardsCount,
    isLoadingColumns,
    isFetchingColumns,
    isErrorColumns,

    addCard,
    editCard,
    moveCard,
    removeCard,

  } = useKanbanData();

  // ------------------------------------
  // Dialog State
  // ------------------------------------
  const [cardDialog, setCardDialog] = useState<CardDialogState>({
    isOpen: false,
    columnId: "",
    editCard: null,
  });

  // Track original column before drag starts
  const [draggedCardOriginalColumn, setDraggedCardOriginalColumn] = useState<string | null>(null);


  // 👇 CORREÇÃO: Estado unificado para exclusão (Card ou Coluna)
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    type: null,
    id: null,
  });

  // ------------------------------------
  // Card Handlers
  // ------------------------------------
  const handleOpenAddCard = useCallback((columnId: string) => {
    setCardDialog({ isOpen: true, columnId, editCard: null });
  }, []);

  const handleOpenEditCard = useCallback((card: KanbanCardType) => {
    setCardDialog({
      isOpen: true,
      columnId: card.stepColumnId,
      editCard: card,
    });
  }, []);

  // Abre modal para deletar Card
  const handleDeleteCard = useCallback((cardId: string) => {
    setDeleteDialog({ isOpen: true, type: 'card', id: cardId });
  }, []);

  const handleCardSubmit = useCallback(
    (data: CardFormValues) => {
      if (cardDialog.editCard) {
        editCard.mutate({
          companyCardId: cardDialog.editCard.id,
          description: data.description || "",
          name: data.name || "",
          priority: data.priority ?? "Média Prioridade",
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      } else {
        addCard.mutate({
          description: data.description || "",
          name: data.name || "",
          priority: data.priority ?? "Média Prioridade",
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      }

      setCardDialog({ isOpen: false, columnId: "", editCard: null });
    },
    [cardDialog.editCard, addCard, editCard]
  );

  // ------------------------------------
  // Delete Handler Unificado
  // ------------------------------------
  const confirmDelete = useCallback(() => {
    const { type, id } = deleteDialog;
    if (id && type === 'card') {
      removeCard.mutate(id);
    }
    setDeleteDialog({ isOpen: false, type: null, id: null });
  }, [deleteDialog, removeCard]);


  // ------------------------------------
  // Drag & Drop Handlers
  // ------------------------------------
  const handleDragStart = useCallback(
    (event: { active: { id: string | number } }) => {
      const card = allCards.find((c) => c.id === event.active.id);
      if (card) {
        setDraggedCardOriginalColumn(card.stepColumnId);
      }
    },
    [allCards]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;


      if (!over || active.id === over.id) {
        setDraggedCardOriginalColumn(null);
        return;
      }

      const draggedCard = allCards.find((c) => c.id === active.id);
      if (!draggedCard) {
        setDraggedCardOriginalColumn(null);
        return;
      }

      // Determine target column: either the column itself or the column of the card we're hovering over
      const targetColumnId =
        columns.find((col) => col.id === over.id)?.id ||
        allCards.find((c) => c.id === over.id)?.stepColumnId;


      if (!targetColumnId || targetColumnId === draggedCardOriginalColumn) {
        setDraggedCardOriginalColumn(null);
        return;
      }

      // Call API to update the card's column with complete payload (same as dialog)
      moveCard.mutate({
        companyCardId: draggedCard.id,
        name: draggedCard.name || "",
        description: draggedCard.description || "",
        priority: draggedCard.priority ?? "Média Prioridade",
        companyId: draggedCard.companyId,
        stepColumnId: targetColumnId,
      });

      // Reset tracking
      setDraggedCardOriginalColumn(null);
    },
    [allCards, columns, moveCard, draggedCardOriginalColumn]
  );

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <div className="min-h-screen bg-background px-0 py-0">
      {/* Header */}
      <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)]">
        <div className="bg-sidebar flex items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Kanban Tantto
            </h1>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#A3A6B1] font-medium">Por Status:</span>
                <span className="flex items-center">
                  <span className="text-white font-semibold text-base">
                    Todas Tasks
                  </span>
                  <span className="ml-2 bg-[#22C55E] text-white rounded-full px-2 py-0.5 text-xs font-bold">
                    {totalCardsCount}
                  </span>
                </span>
              </div>

              <div className="mt-1 ml-[90px] h-[3px] w-[60px] bg-[#22C55E] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Header Spacer */}
      <div className="h-24" />

      {/* Kanban */}
      <div className="px-4 py-6 w-full overflow-x-auto">
        <AsyncBoundary
          isLoading={isLoadingColumns}
          isFetching={isFetchingColumns}
          isError={isErrorColumns}
          data={columns}
          emptyFallback={
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-[#A3A6B1] mb-4">Nenhuma coluna encontrada.</p>
            </div>
          }
        >
          {(columnsData) => (
            <KanbanProvider
              columns={columnsData}
              data={allCards}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {(column) => (
                <KanbanBoard
                  key={column.id}
                  id={column.id}
                  className="min-w-[340px] max-w-sm"
                >
                  <KanbanColumnHeader
                    column={column}
                    onAddCard={() => handleOpenAddCard(column.id)}
                  />

                  <KanbanCards id={column.id} className="min-h-[120px]">
                    {(item) => (
                      <KanbanCard key={item.id} {...item}>
                        <KanbanCardItem
                          card={item as KanbanCardType}
                          onEdit={handleOpenEditCard}
                          onDelete={handleDeleteCard}
                        />
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              )}
            </KanbanProvider>
          )}
        </AsyncBoundary>
      </div>

      {/* Card Dialog */}
      <KanbanCardDialog
        open={cardDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setCardDialog({ isOpen: false, columnId: "", editCard: null })
        }
        onSubmit={handleCardSubmit}
        columnId={cardDialog.columnId}
        editCard={cardDialog.editCard}
        companies={companies}
        isSubmitting={addCard.isPending || editCard.isPending}
      />

      {/* Confirm Dialog (Unificado e Dinâmico) */}
      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, isOpen: open }))}
        title={"Excluir Card"}
        description={"Tem certeza que deseja excluir este card? Essa ação não pode ser desfeita."}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}