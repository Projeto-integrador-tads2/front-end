"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getNegotiationsByCompany } from "@/services/negotiations/get-by-company";

export default function NegotiationsPage() {
  const router = useRouter();
  const { companyId } = useParams();
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getNegotiationsByCompany(companyId);
      setNegotiations(data);
      setLoading(false);
    };
    loadData();
  }, [companyId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Negociações da Empresa</h1>

      <button
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
        onClick={() => router.back()}
      >
        Voltar
      </button>

      {loading ? (
        <p>Carregando...</p>
      ) : negotiations.length === 0 ? (
        <p>Nenhuma negociação encontrada.</p>
      ) : (
        <ul className="space-y-3">
          {negotiations.map((n) => (
            <li key={n.id} className="p-4 rounded-xl bg-[#34434c] text-white">
              <p><strong>ID:</strong> {n.id}</p>
              <p><strong>Status:</strong> {n.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
