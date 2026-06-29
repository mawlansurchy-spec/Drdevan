export interface HistoryItem {
  id: string;
  timestamp: string;
  imagePreview: string; // Base64
  reportSummary: string;
}

export interface FullHistoryItem {
  id: string;
  timestamp: string;
  image: string; // Base64
  report: string;
}

export interface AnalysisResponse {
  status: string;
  signal_report?: string;
  item?: FullHistoryItem;
  message?: string;
}
