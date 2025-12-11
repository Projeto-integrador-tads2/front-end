"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useClientsData } from "@/components/clients/useClientsData";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { ViewClientDialog } from "@/components/clients/ViewClientDialog";
import { ClientListItem } from "@/components/clients/ClientListItem";
import { AsyncBoundary } from "@/components/common/AsyncBoundary";
import type { Client } from "@/types/client";
import type { ClientFormValues } from "@/validators/client-schema";

/**
 * Dialog state for managing client creation.
 */
type CreateDialogState = {
  isOpen: boolean;
};

/**
 * Dialog state for viewing client details.
 */
type ViewDialogState = {
  isOpen: boolean;
  client: Client | null;
};

/**
 * Clients listing page.
 * Displays a searchable list of clients with create and view functionality.
 */
export default function ClientesPage() {
  // ============================================
  // STATE & DATA HOOKS
  // ============================================

  const {
    clients,
    companies,
    isLoadingClients,
    isFetchingClients,
    isErrorClients,
    clientsError,
    createClientMutation,
  } = useClientsData();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Create dialog state
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    isOpen: false,
  });

  // View dialog state
  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    isOpen: false,
    client: null,
  });

  // ============================================
  // FILTERED DATA
  // ============================================

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase().trim();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.companyName.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Opens the create client dialog.
   */
  const handleOpenCreateDialog = useCallback(() => {
    setCreateDialog({ isOpen: true });
  }, []);

  /**
   * Handles client creation form submission.
   */
  const handleCreateClient = useCallback(
    (data: ClientFormValues) => {
      createClientMutation.mutate(data, {
        onSuccess: () => {
          setCreateDialog({ isOpen: false });
        },
      });
    },
    [createClientMutation]
  );

  /**
   * Opens the view client dialog with the selected client.
   */
  const handleViewClient = useCallback((client: Client) => {
    setViewDialog({
      isOpen: true,
      client,
    });
  }, []);


  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex flex-col min-h-screen p-6">
      {/* Header */}
      <div>
        <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)] bg-background">
          <div className="flex items-center px-8 py-6 justify-between">
            <div className="w-full max-w-240 relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-sidebar focus:outline-none focus:ring-2 focus:ring-primary pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475569]" />
            </div>

            <Button
              className="bg-primary text-white font-bold px-7 py-2 text-[16px] rounded-full! hover:bg-[#16a34a] border-0"
              onClick={handleOpenCreateDialog}
            >
              Adicionar Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Client List */}
      <AsyncBoundary
        isLoading={isLoadingClients}
        isFetching={isFetchingClients}
        isError={isErrorClients}
        error={clientsError}
        data={filteredClients}
        loadingFallback={
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        }
        emptyFallback={
          <div className="flex flex-col items-center justify-center py-16 text-[#A3A6B1]">
            <p className="text-lg">Nenhum cliente encontrado</p>
            <p className="text-sm mt-2">
              {searchQuery
                ? "Tente ajustar sua busca"
                : "Clique em 'Adicionar Cliente' para começar"}
            </p>
          </div>
        }
        errorFallback={
          <div className="flex items-center justify-center py-16 text-destructive">
            <p>Erro ao carregar clientes. Tente novamente.</p>
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-3">
            {data.map((client) => (
              <ClientListItem
                key={client.id}
                client={client}
                onClick={handleViewClient}
                isExpanded={viewDialog.client?.id === client.id}
              />
            ))}
          </div>
        )}
      </AsyncBoundary>

      {/* Create Client Dialog */}
      <CreateClientDialog
        open={createDialog.isOpen}
        onOpenChange={(open) => setCreateDialog({ isOpen: open })}
        onSubmit={handleCreateClient}
        companies={companies}
        isSubmitting={createClientMutation.isPending}
      />

      {/* View Client Dialog */}
      <ViewClientDialog
        open={viewDialog.isOpen}
        onOpenChange={(open) =>
          setViewDialog((prev) => ({ ...prev, isOpen: open }))
        }
        client={viewDialog.client}
      />
    </div>
  );
}
