import { KanbanColumnMutationValues } from "@/validators/kanban";
import api from "../api";



export const createStepColumn = async (data: KanbanColumnMutationValues) => {
  const payload = {
  ...data,
  isActive: true,
  };
  // Simula uma chamada de API para criar uma nova coluna no Kanban
  console.log("Creating Kanban Column with data:", payload);
  const response = await api.post("/StepColumn/register", payload);
  return response.data;
}
