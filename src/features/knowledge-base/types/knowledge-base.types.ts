export type KnowledgeReferenceType = "road-sign" | (string & {});

export type KnowledgeRefKey = {
  type: KnowledgeReferenceType;
  id: string;
  code: string;
};

export type KnowledgeDetail = {
  id: string;
  type: KnowledgeReferenceType;
  code: string;
  imageUrl: string | null;
  title: string;
  description: string | null;
  status: string;
  category: { id: string; name: string | null } | null;
  relatedQuestionCount: number;
};
