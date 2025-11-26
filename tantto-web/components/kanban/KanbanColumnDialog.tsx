import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { KanbanColumn } from "@/types/kanban";

/**
 * Schema for column form validation.
 */
const columnFormSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(30, "Máximo 30 caracteres"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar no formato #RRGGBB"),
});

export type ColumnFormValues = z.infer<typeof columnFormSchema>;

export type KanbanColumnDialogProps = {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when form is submitted */
  onSubmit: (data: ColumnFormValues) => void;
  /** Edit mode: existing column data to edit */
  editColumn?: KanbanColumn | null;
  /** Loading state for submit button */
  isSubmitting?: boolean;
};

/**
 * Predefined color options for quick selection.
 */
const colorPresets = [
  "#3B82F6", // Blue
  "#22C55E", // Green
  "#F59E42", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange (darker)
];

/**
 * Dialog for creating or editing Kanban columns.
 *
 * @example
 * // Create mode
 * <KanbanColumnDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSubmit={handleCreateColumn}
 * />
 *
 * @example
 * // Edit mode
 * <KanbanColumnDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSubmit={handleEditColumn}
 *   editColumn={selectedColumn}
 * />
 */
export function KanbanColumnDialog({
  open,
  onOpenChange,
  onSubmit,
  editColumn,
  isSubmitting = false,
}: KanbanColumnDialogProps) {
  const isEditMode = !!editColumn;

  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name: "",
      color: "#3B82F6",
    },
  });

  // Reset form when dialog opens or edit column changes
  useEffect(() => {
    if (open) {
      if (editColumn) {
        form.reset({
          name: editColumn.name || "",
          color: editColumn.color || "#3B82F6",
        });
      } else {
        form.reset({
          name: "",
          color: "#3B82F6",
        });
      }
    }
  }, [open, editColumn, form]);

  const handleSubmit = (data: ColumnFormValues) => {
    onSubmit(data);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const selectedColor = form.watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden bg-[#23262F] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: 'var(--font-jakarta-sans, sans-serif)' }}
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold text-white">
              {isEditMode ? "Editar Coluna" : "Adicionar Coluna"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-2">
            {/* Column Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#A3A6B1] font-medium">Nome *</label>
              <Input
                {...form.register("name")}
                placeholder="Nome da coluna"
                className="rounded-lg bg-[#292C36] text-sm font-medium text-white placeholder:text-[#A3A6B1] border-0"
                autoFocus
              />
              {form.formState.errors.name && (
                <span className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#A3A6B1] font-medium">Cor *</label>

              {/* Color Presets */}
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-white scale-110"
                        : "border-transparent hover:border-white/50"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => form.setValue("color", color)}
                  />
                ))}
              </div>

              {/* Custom Color Picker */}
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  {...form.register("color")}
                  className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer"
                  style={{ backgroundColor: selectedColor }}
                />
                <Input
                  value={selectedColor}
                  onChange={(e) => form.setValue("color", e.target.value)}
                  placeholder="#3B82F6"
                  className="rounded-lg bg-[#292C36] text-xs text-white placeholder:text-[#A3A6B1] border-0 flex-1"
                />
              </div>
              {form.formState.errors.color && (
                <span className="text-xs text-destructive">
                  {form.formState.errors.color.message}
                </span>
              )}
            </div>

            {/* Color Preview */}
            <div
              className="h-3 rounded-full transition-colors"
              style={{ backgroundColor: selectedColor }}
            />
          </div>

          <DialogFooter className="flex flex-row gap-2 px-6 pb-6 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-lg bg-[#292C36] text-[#A3A6B1] hover:bg-[#363A46] border-0"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-lg bg-primary text-white hover:bg-[#16a34a]"
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
