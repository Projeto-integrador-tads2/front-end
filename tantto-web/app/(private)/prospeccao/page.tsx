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

import {
  KanbanColumnDialog,
  type ColumnFormValues,
} from "@/components/kanban/KanbanColumnDialog";

import { KanbanCardItem } from "@/components/kanban/KanbanCardItem";
import { KanbanColumnHeader } from "@/components/kanban/KanbanColumnHeader";
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/common/AsyncBoundary";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import type {
  KanbanCard as KanbanCardType,
  KanbanColumn,
} from "@/types/kanban";

// -----------------------------
// Dialog State Types
// -----------------------------
type CardDialogState = {
  isOpen: boolean;
  columnId: string;
  editCard: KanbanCardType | null;
};

type ColumnDialogState = {
  isOpen: boolean;
  editColumn: KanbanColumn | null;
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

    addColumn,
    editColumn,
    removeColumn,
  } = useKanbanData();

  // ------------------------------------
  // Dialog State
  // ------------------------------------
  const [cardDialog, setCardDialog] = useState<CardDialogState>({
    isOpen: false,
    columnId: "",
    editCard: null,
  });

  const [columnDialog, setColumnDialog] = useState<ColumnDialogState>({
    isOpen: false,
    editColumn: null,
  });

  // 👇 CORREÇÃO: O useState foi movido para CA (dentro da função)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; cardId: string | null }>({
    isOpen: false,
    cardId: null,
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

  const handleDeleteCard = useCallback((cardId: string) => {
    setDeleteDialog({ isOpen: true, cardId });
  }, []);

  /**
   * Função que realmente vai no banco deletar (chamada pelo modal)
   */
  const confirmDeleteCard = useCallback(() => {
    if (deleteDialog.cardId) {
      removeCard.mutate(deleteDialog.cardId);
      setDeleteDialog({ isOpen: false, cardId: null });
    }
  }, [deleteDialog.cardId, removeCard]);

  const handleCardSubmit = useCallback(
    (data: CardFormValues) => {
      if (cardDialog.editCard) {
        editCard.mutate({
          companyCardId: cardDialog.editCard.id,
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      } else {
        addCard.mutate({
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      }

      setCardDialog({ isOpen: false, columnId: "", editCard: null });
    },
    [cardDialog.editCard, addCard, editCard]
  );

  // ------------------------------------
  // Column Handlers
  // ------------------------------------
  const handleOpenAddColumn = useCallback(() => {
    setColumnDialog({ isOpen: true, editColumn: null });
  }, []);

  const handleOpenEditColumn = useCallback((column: KanbanColumn) => {
    setColumnDialog({ isOpen: true, editColumn: column });
  }, []);

  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      removeColumn.mutate(columnId);
    },
    [removeColumn]
  );

  const handleColumnSubmit = useCallback(
    (data: ColumnFormValues) => {
      if (columnDialog.editColumn) {
        editColumn.mutate({
          id: columnDialog.editColumn.id,
          name: data.name,
          color: data.color,
        });
      } else {
        addColumn.mutate({
          name: data.name,
          color: data.color,
          order: columns.length + 1,
        });
      }

      setColumnDialog({ isOpen: false, editColumn: null });
    },
    [columnDialog.editColumn, addColumn, editColumn, columns.length]
  );

  // ------------------------------------
  // Drag & Drop Handler
  // ------------------------------------
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const draggedCard = allCards.find((c) => c.id === active.id);
      if (!draggedCard) return;

      const targetColumnId =
        columns.find((col) => col.id === over.id)?.id ||
        allCards.find((c) => c.id === over.id)?.stepColumnId;

      if (!targetColumnId || targetColumnId === draggedCard.stepColumnId) return;

      moveCard.mutate({
        cardId: draggedCard.id,
        targetColumnId,
        companyId: draggedCard.companyId,
      });
    },
    [allCards, columns, moveCard]
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

          <Button
            className="bg-primary text-white font-bold px-7 py-2 text-[16px] rounded-full hover:bg-[#16a34a]"
            onClick={handleOpenAddColumn}
          >
            Adicionar Coluna
          </Button>
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
              <Button
                className="bg-primary text-white font-bold px-6 py-2 rounded-full"
                onClick={handleOpenAddColumn}
              >
                Criar primeira coluna
              </Button>
            </div>
          }
        >
          {(columnsData) => (
            <KanbanProvider
              columns={columnsData}
              data={allCards}
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
                    onEditColumn={handleOpenEditColumn}
                    onDeleteColumn={handleDeleteColumn}
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

      {/* Column Dialog */}
      <KanbanColumnDialog
        open={columnDialog.isOpen}
        onOpenChange={(open) =>
          !open && setColumnDialog({ isOpen: false, editColumn: null })
        }
        onSubmit={handleColumnSubmit}
        editColumn={columnDialog.editColumn}
        isSubmitting={addColumn.isPending || editColumn.isPending}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, isOpen: open }))}
        title="Excluir card"
        description="Tem certeza que deseja excluir este card? Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDeleteCard}
      />
    </div>
  );
}