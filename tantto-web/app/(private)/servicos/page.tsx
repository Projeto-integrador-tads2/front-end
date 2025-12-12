"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trash2, X, Pencil } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { CreateServiceDialog } from "@/components/services/CreateServiceDialog";

/* ==========================================
   TIPO DE SERVIÇO (PROVISÓRIO)
========================================== */
interface Service {
    id: string;
    name: string;
    description: string;
    contractTime?: string;
    price?: string;
}

/* ==========================================
   PAGE — Services
========================================== */
export default function ServicesPage() {
    // Dados provisórios
    const [services, setServices] = useState<Service[]>([
        { id: "1", name: "Consultoria", description: "Consultoria empresarial" },
        { id: "2", name: "Marketing", description: "Gestão de redes sociais" }
    ]);

    const [searchQuery, setSearchQuery] = useState("");

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;

        const q = searchQuery.toLowerCase();

        return services.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q)
        );
    }, [services, searchQuery]);

    return (
        <div className="min-h-screen bg-background">

            {/* HEADER */}
            <div className="fixed top-0 left-64 z-40 w-[calc(100%-16rem)] bg-background">
                <div className="flex items-center px-8 py-6 justify-between">

                    {/* SEARCH */}
                    <div className="w-full max-w-240 relative">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-2xl bg-sidebar pl-10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#475569]" />
                    </div>

                    <Button
                        className="bg-primary text-white font-bold px-7 py-2 text-[16px] !rounded-full hover:bg-[#16a34a]"
                        onClick={() => {
                            setIsEditing(false);
                            setSelectedService(null);
                            setIsServiceModalOpen(true);
                        }}
                    >
                        Adicionar Serviço
                    </Button>

                </div>
            </div>

            {/* LISTA */}
            <div className="pt-24 px-8 pb-8">

                {filteredServices.length === 0 ? (
                    <p className="text-center text-[#A3A6B1]">Nenhum serviço encontrado</p>
                ) : (
                    <div className="space-y-3">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service);
                                    setDetailsModalOpen(true);
                                }}
                                className="flex items-center gap-3 p-4 rounded-3xl bg-[#34434c] hover:bg-[#49565e] 
                                    border border-[#34434c] transition cursor-pointer"
                            >

                                <div className="w-12 h-12 rounded-full bg-primary/70 text-white font-bold flex items-center justify-center">
                                    {service.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{service.name}</h3>
                                    <p className="text-xs text-[#A3A6B1] truncate">{service.description}</p>
                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedService(service);
                                            setIsEditing(true);
                                            setIsServiceModalOpen(true);
                                        }}
                                        className="p-2 rounded-full bg-slate-700/10 hover:bg-slate-700/20 text-slate-300"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setServiceToDelete(service);
                                            setConfirmDeleteOpen(true);
                                        }}
                                        className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL DE DETALHES */}
            {detailsModalOpen && selectedService && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-sidebar rounded-3xl p-6 w-11/12 max-w-lg border border-[#34434c] shadow-xl">

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/70 text-white font-bold flex items-center justify-center">
                                    {selectedService.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-white text-xl font-semibold">{selectedService.name}</h2>
                            </div>

                            <button onClick={() => setDetailsModalOpen(false)}>
                                <X className="w-5 h-5 text-[#A3A6B1]" />
                            </button>
                        </div>

                        <div className="space-y-4 text-white">
                            <div>
                                <p className="text-[#A3A6B1] text-sm">Descrição</p>
                                <p className="font-semibold">{selectedService.description}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">

                            <Button
                                className="flex-1 bg-[#244e6a] hover:bg-[#1f4660]"
                                onClick={() => {
                                    setDetailsModalOpen(false);
                                    setIsEditing(true);
                                    setIsServiceModalOpen(true);
                                }}
                            >
                                Editar
                            </Button>

                            <Button
                                className="flex-1 bg-[#292C36] text-[#A3A6B1] hover:bg-[#363A46]"
                                onClick={() => setDetailsModalOpen(false)}
                            >
                                Fechar
                            </Button>

                            <Button
                                className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                onClick={() => {
                                    setDetailsModalOpen(false);
                                    setServiceToDelete(selectedService);
                                    setConfirmDeleteOpen(true);
                                }}
                            >
                                Excluir
                            </Button>

                        </div>

                    </div>
                </div>
            )}

            {/* MODAL CREATE / EDIT SERVICE */}
            <CreateServiceDialog
                open={isServiceModalOpen}
                onOpenChange={setIsServiceModalOpen}
                onSubmit={(data) => console.log("Novo serviço:", data)}
                defaultValues={isEditing ? selectedService ?? undefined : undefined}
            />

            {/* CONFIRM DELETE */}
            <ConfirmDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                title="Excluir Serviço"
                description={`Deseja excluir ${serviceToDelete?.name}?`}
                onConfirm={() => {
                    if (serviceToDelete) {
                        setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
                    }
                    setConfirmDeleteOpen(false);
                }}
            />
        </div>
    );
}
