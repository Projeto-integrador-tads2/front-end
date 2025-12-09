"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import CompanyDialog from "@/components/company/CompanyDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { CompanyFormValues } from "@/components/company/CompanyDialog";

export type Company = CompanyFormValues & {
  id: string;
  avatar?: string; // data URL or image URL
};

export default function EmpresaKanbanPage() {
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenAddCompany = useCallback(
    () => setCompanyDialogOpen(true),
    []
  );

  const handleCompanyDialogOpenChange = useCallback(
    (open: boolean) => setCompanyDialogOpen(open),
    []
  );

  const handleSubmitCompany = useCallback(
    async (data: CompanyFormValues, files: File[]) => {
      let avatarUrl: string | undefined = undefined;

      if (files && files.length > 0) {
        const file = files[0];
        // read as data URL
        avatarUrl = await new Promise<string | undefined>((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve(
              typeof reader.result === "string" ? reader.result : undefined
            );
          reader.onerror = () => resolve(undefined);
          reader.readAsDataURL(file);
        });
      }

      // Create new company with ID and optional avatar
      const newCompany: Company = {
        ...data,
        id: Date.now().toString(), // Simple ID generation
        avatar: avatarUrl,
      };

      setCompanies((prev) => [newCompany, ...prev]);
      console.log("Creating company:", newCompany, files);
    },
    []
  );

  const handleDeleteCompany = useCallback((id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
    // clear selection if it was the one deleted
    setSelectedCompany((prev) => (prev && prev.id === id ? null : prev));
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
              className="rounded-full! font-bold"
              onClick={handleOpenAddCompany}
            >
              Adicionar Empresa
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-24 px-8 pb-8">
        {filteredCompanies.length === 0 ? (
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
                  <Image
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
                  <Image
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
            <div className="flex gap-3 mt-6">
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
        open={companyDialogOpen}
        onOpenChange={handleCompanyDialogOpenChange}
        onSubmit={handleSubmitCompany}
      />
    </div>
  );
}
