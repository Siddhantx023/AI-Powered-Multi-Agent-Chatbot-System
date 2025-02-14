export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Agent {
  name: string;
  description: string;
  icon: string;
  handleMessage: (message: string, context: Message[]) => Promise<string>;
  expertise: string[];
  greeting: string;
}

export interface ChatState {
  messages: Message[];
  selectedAgentId: string;
}