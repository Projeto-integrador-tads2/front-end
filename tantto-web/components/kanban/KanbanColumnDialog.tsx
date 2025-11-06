import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kanbanColumnSchema } from "@/validators/kanban";
import { z } from "zod";
import { useEffect } from "react";

export type KanbanColumnDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof kanbanColumnSchema>) => void;
};

export function KanbanColumnDialog({ open, onOpenChange, onSubmit }: KanbanColumnDialogProps) {
  const form = useForm<z.infer<typeof kanbanColumnSchema>>({
    resolver: zodResolver(kanbanColumnSchema),
    defaultValues: { name: "", color: "#3B82F6" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: "", color: "#3B82F6" });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
            onOpenChange(false);
          })}
          className="flex flex-col gap-0"
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold">Adicionar Coluna</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 px-6 py-2">
            <Input
              {...form.register("name")}
              placeholder="Nome da coluna"
              className="rounded-lg bg-muted text-sm font-medium placeholder:text-muted-foreground"
              autoFocus
            />
            {form.formState.errors.name && (
              <span className="text-xs text-destructive">{form.formState.errors.name.message}</span>
            )}
            <Input
              {...form.register("color")}
              placeholder="#3B82F6"
              className="rounded-lg bg-muted text-xs placeholder:text-muted-foreground"
              type="color"
              style={{ width: 40, height: 40, padding: 0, border: "none" }}
            />
            {form.formState.errors.color && (
              <span className="text-xs text-destructive">{form.formState.errors.color.message}</span>
            )}
          </div>
          <DialogFooter className="flex flex-row gap-2 px-6 pb-6 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-lg bg-primary text-white">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
