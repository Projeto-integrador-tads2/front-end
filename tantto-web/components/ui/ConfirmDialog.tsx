import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirmar exclusão",
  description = "Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden bg-[#242d32] border-0 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
        <div className="px-6 py-5">
          <DialogHeader className="p-0">
            <DialogTitle className="text-lg font-semibold text-white">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 text-sm text-[#A3A6B1]">{description}</div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4">
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="ghost"
              className="rounded-lg bg-[#292C36] text-[#A3A6B1] hover:bg-[#363A46]"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              className="rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
