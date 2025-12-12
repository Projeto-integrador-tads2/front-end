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
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ServiceFormValues, serviceFormSchema } from "@/validators/service-schema";
import type { Service } from "@/types/service";


export type CreateServiceDialogProps = {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when form is submitted */
  onSubmit: (data: ServiceFormValues) => void;
  /** Loading state for submit button */
  isSubmitting?: boolean;
  /** Edit mode: existing service data to edit */
  editService?: Service | null;
};

/**
 * Dialog for creating or editing a service.
 * Follows the existing design and Clients module patterns.
 */
export function CreateServiceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  editService,
}: CreateServiceDialogProps) {
  const isEditMode = !!editService;
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      contractDuration: 1,
      value: 0,
      servicePicture: null,
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...list]);
  };

  // Reset form when dialog opens or edit service changes
  useEffect(() => {
    if (open) {
      if (editService) {
        form.reset({
          name: editService.name,
          description: editService.description,
          contractDuration: editService.contractDuration,
          value: editService.value,
          servicePicture: editService.servicePicture || null,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          contractDuration: 1,
          value: 0,
          servicePicture: null,
        });
      }
      setFiles([]);
    }
  }, [open, editService, form]);

  const handleSubmit = (data: ServiceFormValues) => {
    onSubmit(data);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl! rounded-2xl p-0 overflow-hidden bg-sidebar border-0 shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
        showCloseButton
      >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: "var(--font-jakarta-sans, sans-serif)" }}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold text-white bg-card rounded-full py-2.5 px-5">
              {isEditMode ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 bg-card rounded-3xl px-5 py-6">
              {/* COLUNA ESQUERDA */}
              <div className="space-y-4 text-white">
                {/* Nome */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Serviço:</label>
                  <Input
                    {...form.register("name")}
                    placeholder="Nome do serviço"
                    className="rounded-2xl bg-[#242d32]! text-white text-sm border-0 h-10 px-4"
                    autoFocus
                  />
                  {form.formState.errors.name && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.name.message}
                    </span>
                  )}
                </div>

                {/* Tempo de Contrato */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">
                    Tempo de Contrato (meses):
                  </label>
                  <Controller
                    name="contractDuration"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Ex: 12"
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="rounded-2xl bg-[#242d32]! text-white text-sm border-0 h-10 px-4"
                      />
                    )}
                  />
                  {form.formState.errors.contractDuration && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.contractDuration.message}
                    </span>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Descrição:</label>
                  <Textarea
                    {...form.register("description")}
                    rows={5}
                    placeholder="Descrição detalhada..."
                    className="rounded-2xl bg-[#242d32]! text-white text-sm border-0 px-4 py-3 resize-none"
                  />
                  {form.formState.errors.description && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.description.message}
                    </span>
                  )}
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="space-y-4">
                {/* Upload */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Arquivos:</label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    className="mt-1 h-[140px] bg-[#242d32] border-2 border-dashed border-transparent rounded-3xl flex flex-col items-center justify-center text-sm text-[#A3A6B1]"
                  >
                    <p>Arraste os arquivos ou clique</p>

                    <input
                      id="file"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="file"
                      className="cursor-pointer text-xs text-white bg-primary px-3 py-1 rounded-2xl mt-2"
                    >
                      Selecionar
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="px-3 py-1 bg-muted text-xs rounded text-white"
                        >
                          {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Valor */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Valor (R$):</label>
                  <Controller
                    name="value"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="0,00"
                        value={field.value}
                        onChange={field.onChange}
                        className="rounded-2xl bg-[#242d32]! text-white text-sm border-0 h-10 px-4"
                      />
                    )}
                  />
                  {form.formState.errors.value && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.value.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 flex justify-center gap-4">
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
              {isSubmitting
                ? "Salvando..."
                : isEditMode
                ? "Salvar"
                : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
