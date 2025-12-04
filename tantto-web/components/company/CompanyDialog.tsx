import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export type CompanyFormValues = {
  legalName: string;
  representative: string;
  cnpj: string;
  createdAt: string;
  // files handled separately
};

export type CompanyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CompanyFormValues, files: File[]) => Promise<void> | void;
  isSubmitting?: boolean;
};

export default function CompanyDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CompanyDialogProps) {
  const { register, handleSubmit, reset } = useForm<CompanyFormValues>({
    defaultValues: {
      legalName: "",
      representative: "",
      cnpj: "",
      createdAt: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt) return;
    const list = Array.from(dt.files);
    setFiles((prev) => [...prev, ...list]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
  };

  const onFormSubmit = async (data: CompanyFormValues) => {
    if (onSubmit) await onSubmit(data, files);
    onOpenChange(false);
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden bg-[#23262F] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: "var(--font-jakarta-sans, sans-serif)" }}
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold text-white">
              EMPRESA
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#A3A6B1] font-medium">
                    Razão Social
                  </label>
                  <Input
                    {...register("legalName")}
                    placeholder="Digite aqui.."
                    className="mt-1 bg-[#292C36] text-white border-0"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A3A6B1] font-medium">
                    Cliente Representante
                  </label>
                  <Input
                    {...register("representative")}
                    placeholder="Digite o nome.."
                    className="mt-1 bg-[#292C36] text-white border-0"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A3A6B1] font-medium">
                    CNPJ
                  </label>
                  <Input
                    {...register("cnpj")}
                    placeholder="XXX.XXX.XX/0001-XX"
                    className="mt-1 bg-[#292C36] text-white border-0"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A3A6B1] font-medium">
                    Data de Criação
                  </label>
                  <Input
                    type="date"
                    {...register("createdAt")}
                    className="mt-1 bg-[#292C36] text-white border-0"
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2 px-4 py-2 rounded-full bg-[#292C36] text-[#A3A6B1]"
                  >
                    Negociações
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A3A6B1] font-medium">
                  Mídias
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="mt-1 h-48 rounded-lg bg-[#292C36] border-2 border-dashed border-transparent flex items-center justify-center text-sm text-[#A3A6B1]"
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
                        className="cursor-pointer text-xs text-white bg-[#1F6B3B] px-3 py-1 rounded"
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
              className="flex-1 rounded-lg bg-[#16a34a] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
