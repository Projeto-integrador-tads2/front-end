"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import CompanyDialog from "@/components/company/CompanyDialog";
import type { CompanyFormValues } from "@/components/company/CompanyDialog";

export default function EmpresaKanbanPage() {
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);

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
      // TODO: call API to create the company. For now just log and close.
      console.log("Creating company:", data, files);
    },
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)] bg-background">
          <div className="flex items-center px-8 py-6 justify-between">
            <div className="w-full max-w-[60rem] relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full px-4 py-2 rounded-2xl bg-sidebar focus:outline-none focus:ring-2 focus:ring-primary pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475569]" />
            </div>

            <Button className="rounded-full! font-bold" onClick={handleOpenAddCompany}>Adicionar Empresa</Button>
          </div>
        </div>
      </div>

      <div className="pt-24 pl-64">{/* Lista de empresas */}</div>

      <CompanyDialog
        open={companyDialogOpen}
        onOpenChange={handleCompanyDialogOpenChange}
        onSubmit={handleSubmitCompany}
      />
    </div>
  );
}
