"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Pencil } from "lucide-react";
import { CreateServiceDialog } from "@/components/services/CreateServiceDialog";
import { ViewServiceDialog } from "@/components/services/ViewServiceDialog";
import { useServicesData } from "@/components/services/useServicesData";
import { AsyncBoundary } from "@/components/common/AsyncBoundary";
import type { Service } from "@/types/service";
import type { ServiceFormValues } from "@/validators/service-schema";

/**
 * Dialog state for managing service creation/editing.
 */
type ServiceDialogState = {
  isOpen: boolean;
  editService: Service | null;
};

/**
 * Dialog state for viewing service details.
 */
type ViewDialogState = {
  isOpen: boolean;
  service: Service | null;
};

/**
 * Services listing page.
 * Displays a searchable list of services with create, edit, and delete functionality.
 */
export default function ServicesPage() {
  // ============================================
  // STATE & DATA HOOKS
  // ============================================

  const {
    services,
    isLoadingServices,
    isFetchingServices,
    isErrorServices,
    servicesError,
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation,
  } = useServicesData();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Service dialog state
  const [serviceDialog, setServiceDialog] = useState<ServiceDialogState>({
    isOpen: false,
    editService: null,
  });

  // View dialog state
  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    isOpen: false,
    service: null,
  });

  // Delete confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // ============================================
  // FILTERED DATA
  // ============================================

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Opens the create service dialog.
   */
  const handleOpenCreateDialog = useCallback(() => {
    setServiceDialog({ isOpen: true, editService: null });
  }, []);

  /**
   * Opens the edit service dialog with the selected service.
   */
  const handleOpenEditDialog = useCallback((service: Service) => {
    setServiceDialog({ isOpen: true, editService: service });
  }, []);

  /**
   * Handles service form submission (create or update).
   */
  const handleServiceSubmit = useCallback(
    (data: ServiceFormValues) => {
      if (serviceDialog.editService) {
        // Update existing service
        updateServiceMutation.mutate(
          {
            serviceId: serviceDialog.editService.id,
            data,
          },
          {
            onSuccess: () => {
              setServiceDialog({ isOpen: false, editService: null });
            },
          }
        );
      } else {
        // Create new service
        createServiceMutation.mutate(data, {
          onSuccess: () => {
            setServiceDialog({ isOpen: false, editService: null });
          },
        });
      }
    },
    [serviceDialog.editService, createServiceMutation, updateServiceMutation]
  );

  /**
   * Opens the view service dialog with the selected service.
   */
  const handleViewService = useCallback((service: Service) => {
    setViewDialog({
      isOpen: true,
      service,
    });
  }, []);

  /**
   * Handles service deletion.
   */
  const handleDeleteService = useCallback(() => {
    if (serviceToDelete) {
      deleteServiceMutation.mutate(serviceToDelete.id, {
        onSuccess: () => {
          setConfirmDeleteOpen(false);
          setServiceToDelete(null);
        },
      });
    }
  }, [serviceToDelete, deleteServiceMutation]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)] bg-background">
        <div className="flex items-center px-8 py-6 justify-between">
          {/* SEARCH */}
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
            className="bg-primary text-white font-bold px-7 py-2 text-[16px] rounded-full! hover:bg-[#16a34a]"
            onClick={handleOpenCreateDialog}
          >
            Adicionar Serviço
          </Button>
        </div>
      </div>

      {/* LISTA */}
      <div className="pt-24 px-8 pb-8">
        <AsyncBoundary
          isLoading={isLoadingServices}
          isFetching={isFetchingServices}
          isError={isErrorServices}
          error={servicesError}
          data={filteredServices}
          loadingFallback={
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-20 bg-muted rounded-3xl animate-pulse"
                />
              ))}
            </div>
          }
          emptyFallback={
            <div className="flex flex-col items-center justify-center py-16 text-[#A3A6B1]">
              <p className="text-lg">Nenhum serviço encontrado</p>
              <p className="text-sm mt-2">
                {searchQuery
                  ? "Tente ajustar sua busca"
                  : "Clique em 'Adicionar Serviço' para começar"}
              </p>
            </div>
          }
          errorFallback={
            <div className="flex items-center justify-center py-16 text-destructive">
              <p>Erro ao carregar serviços. Tente novamente.</p>
            </div>
          }
        >
          {(data) => (
            <div className="space-y-3">
              {data.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleViewService(service)}
                  className="flex items-center gap-3 p-4 rounded-3xl bg-card hover:bg-muted
                    border border-card transition cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/70 text-white font-bold flex items-center justify-center">
                    {service.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{service.name}</h3>
                    <p className="text-xs text-[#A3A6B1] truncate">{service.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditDialog(service);
                      }}
                      className="p-2 rounded-full bg-slate-700/10 hover:bg-slate-700/20 text-slate-300"
                      aria-label="Editar serviço"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setServiceToDelete(service);
                        setConfirmDeleteOpen(true);
                      }}
                      className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      aria-label="Excluir serviço"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AsyncBoundary>
      </div>

      {/* VIEW SERVICE DIALOG */}
      <ViewServiceDialog
        open={viewDialog.isOpen}
        onOpenChange={(open) =>
          setViewDialog((prev) => ({ ...prev, isOpen: open }))
        }
        service={viewDialog.service}
      />

      {/* CREATE / EDIT SERVICE DIALOG */}
      <CreateServiceDialog
        open={serviceDialog.isOpen}
        onOpenChange={(open) =>
          setServiceDialog((prev) => ({ ...prev, isOpen: open }))
        }
        onSubmit={handleServiceSubmit}
        editService={serviceDialog.editService}
        isSubmitting={
          createServiceMutation.isPending || updateServiceMutation.isPending
        }
      />

      {/* CONFIRM DELETE DIALOG */}
      {confirmDeleteOpen && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-sidebar rounded-2xl p-6 w-11/12 max-w-md border border-card shadow-xl">
            <h3 className="text-white text-lg font-semibold mb-4">
              Excluir Serviço
            </h3>
            <p className="text-[#A3A6B1] mb-6">
              Deseja realmente excluir o serviço <strong>{serviceToDelete.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setServiceToDelete(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteService}
                disabled={deleteServiceMutation.isPending}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                {deleteServiceMutation.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
