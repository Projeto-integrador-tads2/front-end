"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import type { Client } from "@/types/client";

export type ViewClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
};

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
}


export function ViewClientDialog({
  open,
  onOpenChange,
  client,
}: ViewClientDialogProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-card border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]"
        showCloseButton={false}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt={client.name} />
                <AvatarFallback className="bg-muted text-white font-semibold">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Cliente {client.name.split(" ")[0]} - {client.companyName}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="bg-muted rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Informações
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Nome Completo:
                  </label>
                  <div className="rounded-xl bg-input text-sm text-white h-10 px-4 flex items-center">
                    {client.name}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Email:
                  </label>
                  <div className="rounded-xl bg-input text-sm text-white h-10 px-4 flex items-center">
                    {client.email}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Telefone:
                  </label>
                  <div className="rounded-xl bg-input text-sm text-white h-10 px-4 flex items-center">
                    {client.phone}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Data de Criação:
                  </label>
                  <div className="rounded-xl bg-input text-sm text-white h-10 px-4 flex items-center">
                    {formatDate(client.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
