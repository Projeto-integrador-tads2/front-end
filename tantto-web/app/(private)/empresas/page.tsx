"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, X, Pencil } from "lucide-react";
import CompanyDialog from "@/components/company/CompanyDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { CompanyFormValues } from "@/components/company/CompanyDialog";
import { getAllCompanies } from "@/services/companies/get-all-companies";
import { createCompany } from "@/services/companies/create-company";
import { deleteCompany } from "@/services/companies/delete-company";
import { updateCompany } from "@/services/companies/update-company";
import { toDataUrl } from "@/lib/image";

export type Company = CompanyFormValues & {
  id: string;
  avatar?: string; // data URL or image URL
  companyId?: string; // backend ID
};

export default function EmpresaKanbanPage() {
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCandidate, setEditCandidate] = useState<Company | null>(null);

  // Carregar empresas do backend ao montar o componente
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCompanies();
        // Mapear dados do backend para o tipo local Company
        const mappedCompanies: Company[] = data.map((company) => ({
          legalName: company.name,
          representative: "", // backend não retorna esse campo, manter vazio
          cnpj: company.cnpj,
          createdAt: "", // backend não retorna data de criação
          id: company.companyId || company.name, // usar companyId do backend
          companyId: company.companyId,
          avatar:
            company.companyPicture && company.companyPicture !== "null"
              ? company.companyPicture
              : undefined,
        }));
        setCompanies(mappedCompanies);
      } catch (err) {
        console.error("Erro ao carregar empresas:", err);
        setError("Falha ao carregar empresas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  const handleOpenAddCompany = useCallback(() => {
    setEditCandidate(null);
    setCompanyDialogOpen(true);
  }, []);

  const handleCompanyDialogOpenChange = useCallback(
    (open: boolean) => setCompanyDialogOpen(open),
    []
  );

  const handleSubmitCompany = useCallback(
    async (data: CompanyFormValues, files: File[]) => {
      try {
        let pictureBase64: string | undefined = undefined;

        if (files && files.length > 0) {
          const file = files[0];
          // Converter arquivo para base64
          pictureBase64 = await new Promise<string | undefined>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve(
                typeof reader.result === "string" ? reader.result : undefined
              );
            reader.onerror = () => resolve(undefined);
            reader.readAsDataURL(file);
          });
        }

        if (editCandidate && editCandidate.companyId) {
          // Update existing company
          const payload = {
            name: data.legalName,
            cnpj: data.cnpj.replace(/\D/g, ""),
            ...(pictureBase64 ? { companyPicture: pictureBase64 } : {}),
          };

          const response = await updateCompany(
            editCandidate.companyId,
            payload
          );

          // Update local state using submitted values
          setCompanies((prev) =>
            prev.map((c) =>
              c.companyId === response.companyId
                ? {
                  ...c,
                  legalName: data.legalName,
                  representative: data.representative,
                  cnpj: data.cnpj,
                  createdAt: data.createdAt,
                  avatar: pictureBase64 ?? c.avatar,
                }
                : c
            )
          );
          setEditCandidate(null);
          console.log("Empresa atualizada:", response);
        } else {
          // Create new company
          const response = await createCompany({
            name: data.legalName,
            cnpj: data.cnpj.replace(/\D/g, ""), // remover formatação
            companyPicture: pictureBase64 || undefined,
          });

          // Adicionar empresa retornada do backend à lista local
          const newCompany: Company = {
            legalName: response.name,
            representative: data.representative, // manter do formulário
            cnpj: response.cnpj,
            // Se o usuário forneceu uma data no formulário, use-a. Caso contrário,
            // preencha com a data atual (isso evita que o modal mostre "N/A" após criação).
            createdAt: data.createdAt || new Date().toISOString(),
            id: response.companyId,
            companyId: response.companyId,
            avatar: pictureBase64 ?? toDataUrl(response.companyPicture),
          };

          setCompanies((prev) => [newCompany, ...prev]);
          console.log("Empresa criada com sucesso:", response);
        }
      } catch (err) {
        console.error("Erro ao criar/atualizar empresa:", err);
        alert("Falha ao criar/atualizar empresa. Tente novamente.");
      }
    },
    [editCandidate]
  );

  const handleDeleteCompany = useCallback((id: string) => {
    const deleteAsync = async () => {
      try {
        // Excluir do backend
        await deleteCompany(id);
        // Remover da lista local
        setCompanies((prev) => prev.filter((company) => company.id !== id));
        // Limpar seleção se era a empresa deletada
        setSelectedCompany((prev) => (prev && prev.id === id ? null : prev));
        console.log("Empresa excluída com sucesso");
      } catch (err) {
        console.error("Erro ao excluir empresa:", err);
        alert("Falha ao excluir empresa. Tente novamente.");
      }
    };
    deleteAsync();
  }, []);

  const handleOpenCompanyDetails = useCallback((company: Company) => {
    setSelectedCompany(company);
    setDetailsModalOpen(true);
  }, []);

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (company) =>
      company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)] bg-background">
          <div className="flex items-center px-8 py-6 justify-between">
            <div className="w-full max-w-240 relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-sidebar focus:outline-none focus:ring-2 focus:ring-primary pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475569]" />
            </div>

            <Button
              className="bg-primary text-white font-bold px-7 py-2 text-[16px] rounded-full! hover:bg-[#16a34a] border-0"
              onClick={handleOpenAddCompany}
            >
              Adicionar Empresa
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 px-8 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#A3A6B1] mb-4">Carregando empresas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              className="rounded-full! font-bold"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </Button>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#A3A6B1] mb-4">
              {companies.length === 0
                ? "Nenhuma empresa cadastrada"
                : "Nenhuma empresa encontrada"}
            </p>
            {companies.length === 0 && (
              <Button
                className="rounded-full! font-bold"
                onClick={handleOpenAddCompany}
              >
                Cadastrar primeira empresa
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center gap-3 p-4 rounded-3xl bg-[#34434c] hover:bg-[#49565e] border border-[#34434c] hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleOpenCompanyDetails(company)}
              >
                {/* Avatar */}
                {company.avatar ? (
                  <img
                    src={company.avatar}
                    alt={`${company.legalName} avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {company.legalName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                {/* Info - Apenas nome */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate text-sm">
                    {company.legalName}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCandidate(company);
                      setCompanyDialogOpen(true);
                    }}
                    className="p-2 rounded-full bg-slate-700/10 hover:bg-slate-700/20 text-slate-300 transition-colors"
                    title="Editar empresa"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCandidate(company);
                      setConfirmOpen(true);
                    }}
                    className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Excluir empresa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Empresa */}
      {detailsModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-sidebar rounded-3xl p-6 w-11/12 max-w-lg border border-[#34434c] shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedCompany.avatar ? (
                  <img
                    src={selectedCompany.avatar}
                    alt={`${selectedCompany.legalName} avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg">
                    {selectedCompany.legalName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white text-sm">
                    {selectedCompany.legalName}
                  </h2>
                  <p className="text-xs text-[#A3A6B1]">
                    {selectedCompany.representative}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#34434c] text-[#A3A6B1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Informações */}
            <div className="space-y-4 bg-[#242d32] rounded-2xl p-4">
              <div>
                <p className="text-xs text-[#A3A6B1] mb-1">Razão Social</p>
                <p className="text-sm text-white font-medium">
                  {selectedCompany.legalName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#A3A6B1] mb-1">
                  Cliente Representante
                </p>
                <p className="text-sm text-white font-medium">
                  {selectedCompany.representative}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#A3A6B1] mb-1">CNPJ</p>
                <p className="text-sm text-white font-medium">
                  {selectedCompany.cnpj}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#A3A6B1] mb-1">Data de Criação</p>
                <p className="text-sm text-white font-medium">
                  {selectedCompany.createdAt
                    ? new Date(selectedCompany.createdAt).toLocaleDateString(
                      "pt-BR"
                    )
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 mt-6 flex-col">

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (selectedCompany) {
                      // Open edit dialog pre-filled
                      setEditCandidate(selectedCompany);
                      setCompanyDialogOpen(true);
                      setDetailsModalOpen(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-[#244e6a] text-white hover:bg-[#1f4660] transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => setDetailsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-[#292C36] text-[#A3A6B1] hover:bg-[#363A46] transition-colors text-sm font-medium"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    if (selectedCompany) {
                      setDeleteCandidate(selectedCompany);
                      setConfirmOpen(true);
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-2xl cursor-pointer bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog for delete */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteCandidate(null);
        }}
        title="Excluir empresa"
        description={
          deleteCandidate
            ? `Tem certeza que deseja excluir ${deleteCandidate.legalName}? Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (deleteCandidate) {
            handleDeleteCompany(deleteCandidate.id);
            // if the details modal was open for this company, close it
            if (selectedCompany && selectedCompany.id === deleteCandidate.id) {
              setDetailsModalOpen(false);
              setSelectedCompany(null);
            }
            setDeleteCandidate(null);
          }
        }}
      />

      <CompanyDialog
        key={editCandidate ? `edit-${editCandidate.companyId}` : "add"}
        open={companyDialogOpen}
        onOpenChange={handleCompanyDialogOpenChange}
        onSubmit={handleSubmitCompany}
        initialValues={editCandidate ?? undefined}
      />
    </div>
  );
}
