export type RegelrettForm = {
  id: string;
  teamId: string;
  formId: string;
  name: string;
  answeredCount?: number;
  expiredCount?: number;
  totalCount?: number;
};

export type FormType = {
  id: string;
  name: string;
};
