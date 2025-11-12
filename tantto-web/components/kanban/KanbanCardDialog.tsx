import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kanbanCardSchema, KanbanCardValues } from "@/validators/kanban";
import { z } from "zod";
import { useEffect } from "react";

export type KanbanCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Dialog will provide card values except `companyId` (page supplies it)
  onSubmit: (data: Omit<KanbanCardValues, "companyId">) => void;
  columnId: string;
};

export function KanbanCardDialog({ open, onOpenChange, onSubmit, columnId }: KanbanCardDialogProps) {
  // The dialog doesn't collect `companyId` (it's provided by the page),
  // so validate a version of the schema without `companyId`.
  const dialogSchema = kanbanCardSchema.omit({ companyId: true });

  const form = useForm<z.infer<typeof dialogSchema>>({
    resolver: zodResolver(dialogSchema),
    defaultValues: { title: "", description: "", priority: "Alta Prioridade", stepColumnId: columnId },
  });

  useEffect(() => {
    if (open) {
      form.reset({ title: "", description: "", priority: "Alta Prioridade", stepColumnId: columnId });
    }
  }, [open, columnId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden bg-[#23262F] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]">
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
            onOpenChange(false);
          })}
          className="flex flex-col gap-0"
          style={{ fontFamily: 'var(--font-jakarta-sans, sans-serif)' }}
        >
          {/* include hidden registered field so stepColumnId is present in form data */}
          <input type="hidden" {...form.register("stepColumnId")} />
          <DialogHeader className="px-8 pt-7 pb-2">
            <DialogTitle className="text-[18px] font-bold text-white">Adicionar Card</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 px-8 py-2">
            <Input
              {...form.register("title")}
              placeholder="Título do card"
              className="rounded-xl bg-[#292C36] text-[15px] font-semibold text-white placeholder:text-[#A3A6B1] border-0 h-11 px-4"
              autoFocus
            />
            {form.formState.errors.title && (
              <span className="text-xs text-destructive">{form.formState.errors.title.message}</span>
            )}
            <Input
              {...form.register("description")}
              placeholder="Descrição (opcional)"
              className="rounded-xl bg-[#292C36] text-[13px] text-white placeholder:text-[#A3A6B1] border-0 h-10 px-4"
            />
            {form.formState.errors.description && (
              <span className="text-xs text-destructive">{form.formState.errors.description.message}</span>
            )}
            <Select
              value={form.watch("priority")}
              onValueChange={(v) => form.setValue("priority", v as any)}
            >
              <SelectTrigger className="rounded-xl bg-[#292C36] text-[13px] text-white border-0 h-10 px-4">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-[#292C36] text-white border-0">
                <SelectItem value="Alta Prioridade">Alta Prioridade</SelectItem>
                <SelectItem value="Média Prioridade">Média Prioridade</SelectItem>
                <SelectItem value="Baixa Prioridade">Baixa Prioridade</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.priority && (
              <span className="text-xs text-destructive">{form.formState.errors.priority.message}</span>
            )}
          </div>
          <DialogFooter className="flex flex-row gap-2 px-8 pb-7 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl bg-[#292C36] text-[#A3A6B1] border-0 h-11 font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-[#22C55E] text-white h-11 font-bold border-0 shadow-none">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
