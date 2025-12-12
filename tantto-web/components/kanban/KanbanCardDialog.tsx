import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { KanbanCard, KanbanPriority } from "@/types/kanban";
import type { CompanyDto } from "@/types/kanban";

/**
 * Schema for card form validation.
 * Validates title, description, priority, and required IDs.
 */
const cardFormSchema = z.object({
  name: z.string().min(1, "Título obrigatório").max(60, "Máximo 60 caracteres").optional(),
  description: z.string().max(200, "Máximo 200 caracteres").optional(),
  priority: z.enum(["Alta Prioridade", "Média Prioridade", "Baixa Prioridade"]).optional(),
  stepColumnId: z.string().min(1, "Coluna obrigatória"),
  companyId: z.string().min(1, "Empresa obrigatória"),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;

export type KanbanCardDialogProps = {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when form is submitted */
  onSubmit: (data: CardFormValues) => void;
  /** The target column ID for new cards */
  columnId: string;
  /** Edit mode: existing card data to edit */
  editCard?: KanbanCard | null;
  /** List of available companies for selection */
  companies?: CompanyDto[];
  /** Loading state for submit button */
  isSubmitting?: boolean;
};

export function KanbanCardDialog({
  open,
  onOpenChange,
  onSubmit,
  columnId,
  editCard,
  companies = [],
  isSubmitting = false,
}: KanbanCardDialogProps) {
  const isEditMode = !!editCard;

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "Alta Prioridade",
      stepColumnId: columnId,
      companyId: "",
    },
  });

  // Reset form when dialog opens or edit card changes
  useEffect(() => {
    if (open) {
      console.log(editCard)
      if (editCard) {
        form.reset({
          name: editCard.title || "",
          description: editCard.description || "",
          priority: editCard.priority || "Alta Prioridade",
          stepColumnId: editCard.stepColumnId || columnId,
          companyId: editCard.companyId || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
          priority: "Alta Prioridade",
          stepColumnId: columnId,
          companyId: companies[0]?.companyId || "",
        });
      }
    }
  }, [open, columnId, editCard, form, companies]);

  const handleSubmit = (data: CardFormValues) => {
    console.log(data);
    onSubmit(data);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden bg-[#23262F] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: 'var(--font-jakarta-sans, sans-serif)' }}
        >
          {/* Hidden field for stepColumnId */}
          <input type="hidden" {...form.register("stepColumnId")} />

          <DialogHeader className="px-8 pt-7 pb-2">
            <DialogTitle className="text-[18px] font-bold text-white">
              {isEditMode ? "Editar Card" : "Adicionar Card"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 px-8 py-2">
            {/* Company Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#A3A6B1] font-medium">Empresa *</label>
              <Select
                value={form.watch("companyId")}
                onValueChange={(v) => form.setValue("companyId", v)}
              >
                <SelectTrigger className="rounded-2xl bg-[#292C36] text-[13px] text-white border-0 h-10 px-4">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent className="bg-[#292C36] rounded-2xl text-white border-0 max-h-60">
                  {companies.map((company) => (
                    <SelectItem key={company.companyId} value={company.companyId}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.companyId && (
                <span className="text-xs text-destructive">
                  {form.formState.errors.companyId.message}
                </span>
              )}
            </div>

            {/* Title (optional, for display purposes) */}
            <Input
              {...form.register("name")}
              placeholder="Título do card (opcional)"
              className="rounded-2xl bg-[#292C36] text-[15px] font-semibold text-white placeholder:text-[#A3A6B1] border-0 h-11 px-4"
              autoFocus
            />
            {form.formState.errors.name && (
              <span className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </span>
            )}

            {/* Description */}
            <Input
              {...form.register("description")}
              placeholder="Descrição (opcional)"
              className="rounded-2xl bg-[#292C36] font-semibold text-[13px] text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
            />
            {form.formState.errors.description && (
              <span className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </span>
            )}

            {/* Priority Selection */}
            <Select
              value={form.watch("priority")}
              onValueChange={(v) => form.setValue("priority", v as KanbanPriority)}
            >
              <SelectTrigger className="rounded-2xl bg-[#292C36] text-[13px] text-white border-0 h-10 px-4">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-[#292C36] rounded-2xl text-white border-0">
                <SelectItem value="Alta Prioridade">Alta Prioridade</SelectItem>
                <SelectItem value="Média Prioridade">Média Prioridade</SelectItem>
                <SelectItem value="Baixa Prioridade">Baixa Prioridade</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.priority && (
              <span className="text-xs text-destructive">
                {form.formState.errors.priority.message}
              </span>
            )}
          </div>

          <DialogFooter className="flex flex-row gap-2 px-8 pb-7 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl bg-[#292C36] text-[#A3A6B1] border-0 h-11 font-semibold"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-[#22C55E] text-white h-11 font-bold border-0 shadow-none hover:bg-[#16a34a]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : isEditMode ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
