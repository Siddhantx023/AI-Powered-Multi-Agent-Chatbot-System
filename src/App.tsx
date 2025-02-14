import React, { useState, useEffect, useRef } from 'react';
import { User, Code, Sparkles, Send, Clock, Brain } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { agents } from './agents';
import { Message, ChatState } from './types';

const icons = {
  user: User,
  code: Code,
  sparkles: Sparkles,
};

const STORAGE_KEY = 'chatbot_state';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { messages: savedMessages, selectedAgentId } = JSON.parse(savedState) as ChatState;
      setMessages(savedMessages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
      const agent = agents.find(a => a.name === selectedAgentId) || agents[0];
      setSelectedAgent(agent);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const state: ChatState = {
      messages,
      selectedAgentId: selectedAgent.name,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [messages, selectedAgent]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await selectedAgent.handleMessage(input, messages);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAgentChange = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          content: agent.greeting,
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const IconComponent = icons[selectedAgent.icon as keyof typeof icons];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Chatbot</h1>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => {
              const AgentIcon = icons[agent.icon as keyof typeof icons];
              return (
                <button
                  key={agent.name}
                  onClick={() => handleAgentChange(agent)}
                  className={`p-2 rounded-lg flex items-center gap-2 ${
                    selectedAgent.name === agent.name
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <AgentIcon size={20} />
                  <span>{agent.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-start gap-4">
            <IconComponent size={32} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">{selectedAgent.name}</h2>
              <p className="text-gray-600">{selectedAgent.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedAgent.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-1"
                  >
                    <Brain size={14} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        <div
          ref={chatContainerRef}
          className="flex-1 bg-white rounded-lg shadow-sm mb-4 p-4 overflow-y-auto max-h-[60vh]"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <IconComponent size={48} className="mb-2" />
              <p>Start a conversation with {selectedAgent.name}</p>
              <p className="text-sm">{selectedAgent.description}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <IconComponent className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  )}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs text-gray-500 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <Clock size={12} />
                      {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <User className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedAgent.name}...`}
            className="flex-1 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;