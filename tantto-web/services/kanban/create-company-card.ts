import { KanbanCardValues } from "@/validators/kanban";
import api from "../api";

export const createCompanyCard = async (data: KanbanCardValues) => {
  const payload = {
    companyId: data.companyId,
    stepColumnId: data.stepColumnId,
  };
  const response = await api.post("/CompanyCard/register", payload);
  return response.data;
}