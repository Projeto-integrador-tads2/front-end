"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { clientFormSchema, type ClientFormValues } from "@/validators/client-schema";
import type { CompanyDto } from "@/types/kanban";

export type CreateClientDialogProps = {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when form is submitted */
  onSubmit: (data: ClientFormValues) => void;
  /** List of available companies for selection */
  companies?: CompanyDto[];
  /** Loading state for submit button */
  isSubmitting?: boolean;
};

/**
 * Dialog for creating a new client.
 * Follows the design from the provided screenshots.
 */
export function CreateClientDialog({
  open,
  onOpenChange,
  onSubmit,
  companies = [],
  isSubmitting = false,
}: CreateClientDialogProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyId: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        companyId: companies[0]?.companyId || "",
      });
    }
  }, [open, form, companies]);

  const handleSubmit = (data: ClientFormValues) => {
    onSubmit(data);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl rounded-2xl p-0 overflow-hidden bg-card border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]"
        showCloseButton={false}
      >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
        >
          {/* Title Input */}
          <div className="px-6 pt-6">
            <Input
              placeholder="Digite um título..."
              className="rounded-xl bg-secondary text-lg font-semibold text-white placeholder:text-[#A3A6B1] border-0 h-14 px-4"
              disabled
            />
          </div>

          {/* Content Grid */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Informações */}
              <div className="bg-muted rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Informações
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Nome Completo */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#A3A6B1] font-medium">
                      Nome Completo:
                    </label>
                    <Input
                      {...form.register("name")}
                      placeholder="Nome completo do cliente"
                      className="rounded-xl bg-input text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
                      autoFocus
                    />
                    {form.formState.errors.name && (
                      <span className="text-xs text-destructive">
                        {form.formState.errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#A3A6B1] font-medium">
                      Email:
                    </label>
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="email@exemplo.com"
                      className="rounded-xl bg-input text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
                    />
                    {form.formState.errors.email && (
                      <span className="text-xs text-destructive">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#A3A6B1] font-medium">
                      Telefone:
                    </label>
                    <Input
                      {...form.register("phone")}
                      placeholder="(00) 00000-0000"
                      className="rounded-xl bg-input text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
                    />
                    {form.formState.errors.phone && (
                      <span className="text-xs text-destructive">
                        {form.formState.errors.phone.message}
                      </span>
                    )}
                  </div>

                  {/* Empresa */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#A3A6B1] font-medium">
                      Empresa:
                    </label>
                    <Controller
                      name="companyId"
                      control={form.control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="rounded-xl bg-input text-sm text-white border-0 h-10 px-4 w-full">
                            <SelectValue placeholder="Selecione uma empresa" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover text-white border-0 max-h-60">
                        {companies.map((company) => (
                          <SelectItem
                            key={company.companyId}
                            value={company.companyId}
                          >
                            {company.name}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.companyId && (
                      <span className="text-xs text-destructive">
                        {form.formState.errors.companyId.message}
                      </span>
                    )}
                  </div>

                  {/* Data de Criação (read-only) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#A3A6B1] font-medium">
                      Data de Criação:
                    </label>
                    <Input
                      value={new Date().toLocaleDateString("pt-BR")}
                      readOnly
                      className="rounded-xl bg-input text-sm text-white border-0 h-10 px-4 cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Mídias */}
              <div className="bg-muted rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Mídias</h3>

                {/* Drag & Drop Area */}
                <div className="flex items-center justify-center h-48 border-2 border-dashed border-[#A3A6B1] rounded-xl">
                  <p className="text-sm text-[#A3A6B1] text-center px-4">
                    Arraste os arquivos desejados
                    <br />
                    para realizar upload
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 pb-6 pt-0 flex justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="min-w-[120px] h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] h-11 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
