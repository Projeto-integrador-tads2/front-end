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
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { ServiceFormValues, serviceFormSchema } from "@/validators/service-schema";

export type CreateServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServiceFormValues & { files: File[] }) => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
  service?: ServiceFormValues | null;
};

export function CreateServiceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  isEditing = false,
  service = null,
}: CreateServiceDialogProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      contractTime: "",
      description: "",
      price: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...list]);
  };

  /** RESET AO ABRIR O MODAL */
  useEffect(() => {
    if (open) {
      if (isEditing && service) {
        form.reset(service);
      } else {
        form.reset({
          title: "",
          contractTime: "",
          description: "",
          price: "",
        });
      }
      setFiles([]);
    }
  }, [open, service, isEditing, form]);

  const handleSubmit = (data: ServiceFormValues) => {
    onSubmit({ ...data, files });
    if (!isSubmitting) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-3xl rounded-2xl p-0 overflow-hidden !bg-[#242d32] border-0 shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
        showCloseButton
      >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: "var(--font-jakarta-sans, sans-serif)" }}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold text-white bg-[#34434c] rounded-full py-2.5 px-5">
              {isEditing ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 bg-[#34434c] rounded-3xl px-5 py-6">
              {/* COLUNA ESQUERDA */}
              <div className="space-y-4 text-white">
                {/* Nome */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Serviço:</label>
                  <Input
                    {...form.register("title")}
                    placeholder="Nome do serviço"
                    className="rounded-2xl !bg-[#242d32] text-white text-sm border-0 h-10 px-4"
                    autoFocus
                  />
                  {form.formState.errors.title && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.title.message}
                    </span>
                  )}
                </div>

                {/* Tempo */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">
                    Tempo de Contrato:
                  </label>
                  <Input
                    {...form.register("contractTime")}
                    placeholder="Ex: 12 meses"
                    className="rounded-2xl !bg-[#242d32] text-white text-sm border-0 h-10 px-4"
                  />
                  {form.formState.errors.contractTime && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.contractTime.message}
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
                    className="rounded-2xl !bg-[#242d32] text-white text-sm border-0 px-4 py-3 resize-none"
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
                    className="mt-1 h-[140px] !bg-[#242d32] border-2 border-dashed border-[#49565e] rounded-3xl flex flex-col items-center justify-center text-sm text-[#A3A6B1]"
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
                      className="cursor-pointer text-xs text-white bg-[#1F6B3B] px-3 py-1 rounded-2xl mt-2"
                    >
                      Selecionar
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="px-3 py-1 bg-[#1F2937] text-xs rounded text-white"
                        >
                          {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preço */}
                <div>
                  <label className="text-sm text-[#A3A6B1]">Valor:</label>
                  <Input
                    {...form.register("price")}
                    placeholder="R$ 0,00"
                    className="rounded-2xl !bg-[#242d32] text-white text-sm border-0 h-10 px-4"
                  />
                  {form.formState.errors.price && (
                    <span className="text-xs text-destructive">
                      {form.formState.errors.price.message}
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
              className="flex-1 max-w-24 rounded-lg !bg-[#242d32] text-white hover:bg-[#363A46] border-0"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 max-w-24 rounded-lg bg-primary text-white hover:bg-[#15803d]"
            >
              {isSubmitting
                ? "Salvando..."
                : isEditing
                ? "Salvar Alterações"
                : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
