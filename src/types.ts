export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
}

export interface GroundingData {
  searchQueries: string[];
  sources: GroundingSource[];
  searchEntryPointHtml?: string;
}

export interface AgentStep {
  id: string;
  title: string;
  detail?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601
  displayTime?: string;
  groundingData?: GroundingData;
  agentSteps?: AgentStep[];
  baselineComparison?: {
    pastDate: string;
    pastTopic: string;
    changesDetected: boolean;
    summary: string;
  };
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  isBenchmark?: boolean;
  benchmarkKey?: 'crm' | 'postgres' | 'nov3';
  description?: string;
}

export interface ChatStreamEvent {
  type: 'step' | 'grounding' | 'delta' | 'done' | 'error';
  step?: AgentStep;
  grounding?: GroundingData;
  delta?: string;
  messageId?: string;
  error?: string;
}
