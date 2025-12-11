"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Trash2,
  X,
  Pencil,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { useClientsData } from "@/components/clients/useClientsData";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Client } from "@/types/client";
import type { ClientFormValues } from "@/validators/client-schema";

export default function ClientesPage() {
  const {
    clients,
    companies,
    isLoadingClients,
    isErrorClients,
    clientsError,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation,
  } = useClientsData();

  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [clientBeingEdited, setClientBeingEdited] = useState<Client | null>(
    null
  );

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // ---------------- FILTRO ----------------
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchQuery.trim()) return clients;

    const query = searchQuery.toLowerCase().trim();

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.companyName?.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  // ---------------- HANDLERS ----------------
  const handleCreateClient = (data: ClientFormValues) => {
    createClientMutation.mutate(data, {
      onSuccess: () => setIsClientDialogOpen(false),
    });
  };

  const handleEditClient = (data: ClientFormValues) => {
    if (!clientBeingEdited) return;

    updateClientMutation.mutate(
      { id: clientBeingEdited.id, ...data },
      {
        onSuccess: () => {
          setIsClientDialogOpen(false);
          setClientBeingEdited(null);
        },
      }
    );
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;

    deleteClientMutation.mutate(clientToDelete.id, {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        setClientToDelete(null);
      },
    });
  };

  const openEdit = (client: Client) => {
    setClientBeingEdited(client);
    setIsClientDialogOpen(true);
  };

  const openDetails = (client: Client) => {
    setSelectedClient(client);
    setDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
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
            className="bg-primary text-white font-bold px-7 py-2 text-[16px] !rounded-full hover:bg-[#16a34a]"
            onClick={() => {
              setClientBeingEdited(null);
              setIsClientDialogOpen(true);
            }}
          >
            Adicionar Cliente
          </Button>
        </div>
      </div>

      {/* LISTA */}
      <div className="pt-24 px-8 pb-8">
        {isLoadingClients ? (
          <p className="text-center text-[#A3A6B1]">Carregando clientes...</p>
        ) : isErrorClients ? (
          <p className="text-center text-red-400">
            Erro: {clientsError?.message}
          </p>
        ) : filteredClients.length === 0 ? (
          <p className="text-center text-[#A3A6B1]">Nenhum cliente encontrado</p>
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-3 p-4 rounded-3xl bg-[#34434c] hover:bg-[#49565e] border border-[#34434c] transition cursor-pointer"
                onClick={() => openDetails(client)}
              >
                <div className="w-12 h-12 rounded-full bg-primary/70 text-white font-bold flex items-center justify-center">
                  {client.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {client.name}
                  </h3>
                  <p className="text-xs text-[#A3A6B1] truncate">
                    {client.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(client);
                    }}
                    className="p-2 rounded-full bg-slate-700/10 hover:bg-slate-700/20 text-slate-300"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setClientToDelete(client);
                      setConfirmDeleteOpen(true);
                    }}
                    className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES — IGUAL AO DE EMPRESA */}
      {detailsModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-sidebar rounded-3xl p-6 w-11/12 max-w-lg border border-[#34434c]">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/70 text-white font-bold flex items-center justify-center">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-white text-xl font-semibold">
                  {selectedClient.name}
                </h2>
              </div>

              <button onClick={() => setDetailsModalOpen(false)}>
                <X className="w-5 h-5 text-[#A3A6B1]" />
              </button>
            </div>

            {/* Infos */}
            <div className="space-y-4 text-white">

              <div>
                <p className="text-[#A3A6B1] text-sm">Email</p>
                <p className="font-semibold">{selectedClient.email}</p>
              </div>

              <div>
                <p className="text-[#A3A6B1] text-sm">Telefone</p>
                <p className="font-semibold">{selectedClient.phone}</p>
              </div>

              <div>
                <p className="text-[#A3A6B1] text-sm">Empresa Vinculada</p>
                <p className="font-semibold">
                  {selectedClient.companyName || "Sem empresa vinculada"}
                </p>
              </div>

            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Button
                className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-[#244e6a] text-white hover:bg-[#1f4660] transition-colors text-sm font-medium"
                onClick={() => {
                  setDetailsModalOpen(false);
                  openEdit(selectedClient);
                }}
              >
                Editar
              </Button>

              <Button
                className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-[#292C36] text-[#A3A6B1] hover:bg-[#363A46] transition-colors text-sm font-medium"
                onClick={() => setDetailsModalOpen(false)}
              >
                Fechar
              </Button>

              <Button
                className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setClientToDelete(selectedClient);
                  setConfirmDeleteOpen(true);
                }}
              >
                Excluir
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <CreateClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onSubmit={clientBeingEdited ? handleEditClient : handleCreateClient}
        companies={companies}
        isSubmitting={
          createClientMutation.isPending || updateClientMutation.isPending
        }
        defaultValues={
          clientBeingEdited
            ? {
                name: clientBeingEdited.name,
                email: clientBeingEdited.email,
                phone: clientBeingEdited.phone,
                companyId: clientBeingEdited.companyId ?? "",
              }
            : undefined
        }
      />

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Excluir Cliente"
        description={`Deseja excluir ${clientToDelete?.name}?`}
        onConfirm={handleDeleteClient}
        isLoading={deleteClientMutation.isPending}
      />
    </div>
  );
}
