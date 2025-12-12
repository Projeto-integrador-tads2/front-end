"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Service } from "@/types/service";

export type ViewServiceDialogProps = {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Service data to display */
  service: Service | null;
};

/**
 * Dialog for viewing service details in read-only mode.
 */
export function ViewServiceDialog({
  open,
  onOpenChange,
  service,
}: ViewServiceDialogProps) {
  if (!service) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl! rounded-2xl p-0 overflow-hidden bg-[#242d32] border-0 shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-white bg-[#34434c] rounded-full py-2.5 px-5">
            Detalhes do Serviço
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="bg-[#34434c] rounded-3xl px-6 py-6 space-y-4">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-[#242d32]">
                <AvatarFallback className="text-white text-lg bg-[#1F6B3B]">
                  {getInitials(service.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {service.name}
                </h3>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-sm text-[#A3A6B1] font-medium">
                  Descrição:
                </label>
                <p className="text-white text-sm mt-1">
                  {service.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Tempo de Contrato:
                  </label>
                  <p className="text-white text-sm mt-1">
                    {service.contractDuration} {service.contractDuration === 1 ? "mês" : "meses"}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-[#A3A6B1] font-medium">
                    Valor:
                  </label>
                  <p className="text-white text-sm mt-1">
                    {formatCurrency(service.value)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}