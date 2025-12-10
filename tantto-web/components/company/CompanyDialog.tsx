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

// Format CNPJ: XX.XXX.XXX/XXXX-XX
const formatCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export type CompanyFormValues = {
  legalName: string;
  representative: string;
  cnpj: string;
  createdAt: string;
};

export type CompanyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CompanyFormValues, files: File[]) => Promise<void> | void;
  /** If provided, the form will be pre-filled with these values when opened */
  initialValues?: CompanyFormValues | null;
  isSubmitting?: boolean;
};

export default function CompanyDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues = null,
  isSubmitting = false,
}: CompanyDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    defaultValues: {
      legalName: "",
      representative: "",
      cnpj: "",
      createdAt: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const legalNameValue = watch("legalName");
  const cnpjValue = watch("cnpj");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (cnpjValue) {
      const formatted = formatCNPJ(cnpjValue);
      if (formatted !== cnpjValue) {
        setValue("cnpj", formatted);
      }
    }
  }, [cnpjValue, setValue]);

  useEffect(() => {
    if (!open) {
      // When dialog closes, clear form and files so next open starts clean
      reset();
      setFiles([]);
      return;
    }

    // On open: if initialValues are provided, pre-fill; otherwise ensure the
    // form is reset to default empty values (so "Adicionar Empresa" opens empty).
    if (open) {
      if (initialValues) {
        reset(initialValues);
      } else {
        reset();
      }
      // clear any previously selected files when opening
      setFiles([]);
    }
  }, [open, reset, initialValues]);

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
      <DialogContent className="max-w-3xl! rounded-2xl p-0 overflow-hidden bg-[#242d32] border-0 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)]">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-0"
          style={{ fontFamily: "var(--font-jakarta-sans, sans-serif)" }}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold text-white bg-[#34434c] rounded-full py-2.5 px-5">
              EMPRESA {legalNameValue && `- ${legalNameValue}`}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4  bg-[#34434c] rounded-3xl px-5 py-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white font-medium">
                    Razão Social
                  </label>
                  <Input
                    {...register("legalName", {
                      required: "Razão Social é obrigatória",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                    placeholder="Digite aqui.."
                    className={`mt-1 bg-[#242d32]! text-white border-0 ${
                      errors.legalName ? "border-red-500! border!" : ""
                    }`}
                  />
                  {errors.legalName && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.legalName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white font-medium">
                    Cliente Representante
                  </label>
                  <Input
                    {...register("representative", {
                      required: "Cliente Representante é obrigatório",
                      minLength: {
                        value: 3,
                        message: "Mínimo 3 caracteres",
                      },
                    })}
                    placeholder="Digite o nome.."
                    className={`mt-1 bg-[#242d32]! text-white border-0 ${
                      errors.representative ? "border-red-500! border!" : ""
                    }`}
                  />
                  {errors.representative && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.representative.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white font-medium">CNPJ</label>
                  <Input
                    {...register("cnpj", {
                      required: "CNPJ é obrigatório",
                      validate: (value) => {
                        const cleaned = value.replace(/\D/g, "");
                        if (cleaned.length !== 14) {
                          return "CNPJ deve ter 14 dígitos";
                        }
                        return true;
                      },
                    })}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    className={`mt-1 bg-[#242d32]! text-white border-0 ${
                      errors.cnpj ? "border-red-500! border!" : ""
                    }`}
                  />
                  {errors.cnpj && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white font-medium">
                    Data de Criação
                  </label>
                  <Input
                    type="date"
                    {...register("createdAt", {
                      required: "Data de Criação é obrigatória",
                    })}
                    className={`mt-1 bg-[#242d32]! text-white border-0 ${
                      errors.createdAt ? "border-red-500! border!" : ""
                    }`}
                  />
                  {errors.createdAt && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.createdAt.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs text-white font-medium">Mídias</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="mt-1 h-80 bg-[#242d32] border-2 border-dashed border-transparent flex items-center justify-center text-sm text-[#A3A6B1] rounded-3xl"
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
              <DialogFooter className="flex flex-row gap-3 px-6 pb-6 pt-4 items-center justify-end">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 max-w-24 rounded-lg bg-[#242d32] text-white hover:bg-[#363A46] border-0"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 max-w-24 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
