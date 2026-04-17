import { api } from "@/services/api";
import { TicketHistory } from "../types/practice.types";

export const getTicketsHistory = () =>
  api.get<TicketHistory[]>("/tests/tickets/history");
