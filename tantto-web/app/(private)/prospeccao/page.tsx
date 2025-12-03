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
import { KanbanCardDialog, type CardFormValues } from "@/components/kanban/KanbanCardDialog";
import { KanbanColumnDialog, type ColumnFormValues } from "@/components/kanban/KanbanColumnDialog";
import { KanbanCardItem } from "@/components/kanban/KanbanCardItem";
import { KanbanColumnHeader } from "@/components/kanban/KanbanColumnHeader";
import { Button } from "@/components/ui/button";
import { AsyncBoundary } from "@/components/common/AsyncBoundary";
import type { KanbanCard as KanbanCardType, KanbanColumn } from "@/types/kanban";

/**
 * Dialog state for managing card creation/editing.
 */
type CardDialogState = {
  isOpen: boolean;
  columnId: string;
  editCard: KanbanCardType | null;
};

/**
 * Dialog state for managing column creation/editing.
 */
type ColumnDialogState = {
  isOpen: boolean;
  editColumn: KanbanColumn | null;
};

export default function EmpresasKanbanPage() {
  // ============================================
  // STATE & DATA HOOKS
  // ============================================

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

  // Card dialog state
  const [cardDialog, setCardDialog] = useState<CardDialogState>({
    isOpen: false,
    columnId: "",
    editCard: null,
  });

  // Column dialog state
  const [columnDialog, setColumnDialog] = useState<ColumnDialogState>({
    isOpen: false,
    editColumn: null,
  });

  // ============================================
  // CARD HANDLERS
  // ============================================

  /**
   * Opens the card dialog for creating a new card in the specified column.
   */
  const handleOpenAddCard = useCallback((columnId: string) => {
    setCardDialog({
      isOpen: true,
      columnId,
      editCard: null,
    });
  }, []);

  /**
   * Opens the card dialog for editing an existing card.
   */
  const handleOpenEditCard = useCallback((card: KanbanCardType) => {
    setCardDialog({
      isOpen: true,
      columnId: card.stepColumnId,
      editCard: card,
    });
  }, []);

  /**
   * Handles card form submission (create or update).
   */
  const handleCardSubmit = useCallback(
    (data: CardFormValues) => {
      if (cardDialog.editCard) {
        // Update existing card
        editCard.mutate({
          companyCardId: cardDialog.editCard.id,
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      } else {
        // Create new card
        addCard.mutate({
          companyId: data.companyId,
          stepColumnId: data.stepColumnId,
        });
      }
      setCardDialog({ isOpen: false, columnId: "", editCard: null });
    },
    [cardDialog.editCard, addCard, editCard]
  );

  /**
   * Handles card deletion.
   */
  const handleDeleteCard = useCallback(
    (cardId: string) => {
      removeCard.mutate(cardId);
    },
    [removeCard]
  );

  // ============================================
  // COLUMN HANDLERS
  // ============================================

  /**
   * Opens the column dialog for creating a new column.
   */
  const handleOpenAddColumn = useCallback(() => {
    setColumnDialog({
      isOpen: true,
      editColumn: null,
    });
  }, []);

  /**
   * Opens the column dialog for editing an existing column.
   */
  const handleOpenEditColumn = useCallback((column: KanbanColumn) => {
    setColumnDialog({
      isOpen: true,
      editColumn: column,
    });
  }, []);

  /**
   * Handles column form submission (create or update).
   */
  const handleColumnSubmit = useCallback(
    (data: ColumnFormValues) => {
      if (columnDialog.editColumn) {
        // Update existing column
        editColumn.mutate({
          id: columnDialog.editColumn.id,
          name: data.name,
          color: data.color,
        });
      } else {
        // Create new column
        const order = columns.length + 1;
        addColumn.mutate({
          name: data.name,
          order,
          color: data.color,
        });
      }
      setColumnDialog({ isOpen: false, editColumn: null });
    },
    [columnDialog.editColumn, columns.length, addColumn, editColumn]
  );

  /**
   * Handles column deletion.
   */
  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      removeColumn.mutate(columnId);
    },
    [removeColumn]
  );

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================

  /**
   * Handles drag end event for moving cards between columns.
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Find the card that was dragged
      const draggedCard = allCards.find((card) => card.id === active.id);
      if (!draggedCard) return;

      // Determine target column
      const targetColumnId =
        columns.find((col) => col.id === over.id)?.id ||
        allCards.find((card) => card.id === over.id)?.stepColumnId;

      if (targetColumnId && targetColumnId !== draggedCard.stepColumnId) {
        moveCard.mutate({
          cardId: draggedCard.id,
          targetColumnId,
          companyId: draggedCard.companyId,
        });
      }
    },
    [allCards, columns, moveCard]
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-background px-0 py-0">
      <div>
        {/* Fixed Header */}
        <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)]">
          <div className="bg-sidebar flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Kanban Tantto</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-[#A3A6B1]">Por Status:</span>
                <Button
                  size="sm"
                  className="bg-[#23262F] text-white rounded-full px-4 py-1 h-7 text-xs font-semibold border border-[#3B82F6] flex items-center gap-2"
                >
                  Todas Tasks
                  <span className="ml-2 bg-[#22C55E] text-white rounded-full px-2 py-0.5 text-xs font-bold">
                    {totalCardsCount}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              className="bg-primary text-white font-bold rounded-full! px-7 py-2 text-[16px] hover:bg-[#16a34a] border-0"
              onClick={handleOpenAddColumn}
            >
              Adicionar Coluna
            </Button>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="h-24" />

        {/* Kanban Board */}
        <div className="px-4 py-6">
          <div className="w-full overflow-x-auto">
            <AsyncBoundary
              isFetching={isFetchingColumns}
              isLoading={isLoadingColumns}
              isError={isErrorColumns}
              data={columns}
              emptyFallback={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-[#A3A6B1] mb-4">Nenhuma coluna encontrada.</p>
                  <Button
                    className="bg-primary text-white font-bold rounded-full px-6 py-2"
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
        </div>
      </div>

      {/* Card Dialog */}
      <KanbanCardDialog
        open={cardDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCardDialog({ isOpen: false, columnId: "", editCard: null });
          }
        }}
        onSubmit={handleCardSubmit}
        columnId={cardDialog.columnId}
        editCard={cardDialog.editCard}
        companies={companies}
        isSubmitting={addCard.isPending || editCard.isPending}
      />

      {/* Column Dialog */}
      <KanbanColumnDialog
        open={columnDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setColumnDialog({ isOpen: false, editColumn: null });
          }
        }}
        onSubmit={handleColumnSubmit}
        editColumn={columnDialog.editColumn}
        isSubmitting={addColumn.isPending || editColumn.isPending}
      />
    </div>
  );
}
