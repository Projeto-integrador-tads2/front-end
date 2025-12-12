"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  clientFormSchema,
  type ClientFormValues,
} from "@/validators/client-schema";
import type { CompanyDto } from "@/types/kanban";
import type { Client } from "@/types/client";
import { useState } from "react";

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
  /** Client to edit (if in edit mode) */
  editClient?: Client | null;
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
  editClient = null,
}: CreateClientDialogProps) {
  const isEditMode = !!editClient;
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyId: "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
  };

  const [files, setFiles] = useState<File[]>([]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (editClient) {
        form.reset({
          name: editClient.name,
          email: editClient.email,
          phone: editClient.phone,
          companyId: editClient.companyId || "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          companyId: companies[0]?.companyId || "",
        });
      }
    }
  }, [open, form, companies, editClient]);

  const handleSubmit = (data: ClientFormValues) => {
    onSubmit(data);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt) return;
    const list = Array.from(dt.files);
    setFiles((prev) => [...prev, ...list]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl! rounded-2xl p-0 overflow-hidden bg-[#242d32] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]"
        showCloseButton={true}
      >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: "var(--font-jakarta-sans, sans-serif)" }}
        >
          {/* Title Input */}
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold text-white bg-[#34434c] rounded-full py-2.5 px-5">
              {isEditMode ? "Editar Cliente" : "Cliente"}
            </DialogTitle>
          </DialogHeader>

          {/* Content Grid */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4  bg-[#34434c] rounded-3xl px-5 py-6">
              {/* Left Column - Informações */}
              <div className="space-y-3">
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
                      className="rounded-2xl bg-[#242d32]! text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
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
                      className="rounded-2xl bg-[#242d32]! text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
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
                      className="rounded-2xl bg-[#242d32]! text-sm text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="rounded-2xl bg-[#242d32]! text-sm text-white border-0 h-10 px-4 w-full">
                            <SelectValue placeholder="Selecione uma empresa" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl bg-[#242d32]! text-white border-0 max-h-60">
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
                      className="rounded-2xl bg-[#242d32]! text-sm text-white border-0 h-10 px-4 cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Mídias */}
              <div>
                <label className="text-xs text-white font-medium">Mídias</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="mt-1 h-100 bg-[#242d32] border-2 border-dashed border-transparent flex items-center justify-center text-sm text-[#A3A6B1] rounded-3xl"
                >
                  <div className="text-center">
                    <p>Arraste os arquivos desejados</p>
                    <p>para realizar upload</p>
                    <div className="mt-2">
                      <input
                        id="file"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="file"
                        className="cursor-pointer text-xs text-white bg-[#1F6B3B] px-3 py-1 rounded-2xl"
                      >
                        Selecionar
                      </label>
                    </div>
                  </div>
                </div>

                {/* preview */}
                {files.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 rounded bg-[#1F2937] text-xs text-white"
                      >
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 pt-0 flex justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1 max-w-24 rounded-lg bg-[#242d32] text-white hover:bg-[#363A46] border-0"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 max-w-24 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d]"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
