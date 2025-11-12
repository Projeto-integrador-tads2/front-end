import api from "../api";

export const getAllColumns = async () => {
  // Simula uma chamada de API para obter todas as colunas do Kanban
  const response = await api.get("CompanyCard/cards/grouped");
  console.log("Fetched Kanban Columns:", response.data);
  return response.data;
}