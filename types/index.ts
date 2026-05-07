export type DocumentInfo = {
  id: string;
  name: string;
  size: string;
  status: 'Processing' | 'Indexed' | 'Error';
  mimeType: string;
  base64?: string;
  textContent?: string;
};

export type SummaryData = {
  insights: string[];
  actionPoints: string[];
  suggestedQuestions?: string[];
};
