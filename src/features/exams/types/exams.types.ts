import {
  ExamHistoryEntry,
  TestMode,
  TestStatus,
} from "../../practice/types/practice.types";

export interface GetExamHistoryParams {
  mode?: TestMode;
  status?: TestStatus;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface ExamHistoryResponse {
  tests: ExamHistoryEntry[];
  total: number;
}
