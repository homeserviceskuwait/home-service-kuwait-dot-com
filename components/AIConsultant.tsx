import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, ChatSender } from '../types';

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: ChatSender.AI,
      text: "Hello! I'm Hani. I can help you with quotes for CCTV, Smart Locks, or Intercoms. What do you need today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef(createChatSession());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSessionRef.current, userMessage.text);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: ChatSender.AI,
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="ai-consultant" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/3 text-center lg:text-left text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-teal-300 font-semibold text-sm mb-6 border border-white/10">
              <Sparkles className="h-4 w-4" />
              <span>AI Smart Consultant</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Instant Answers. <br />
              <span className="text-slate-400">Zero Waiting.</span>
            </h2>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              Not sure which Smart Lock fits your door? Need a rough estimate for 4 cameras? Ask Hani, our AI expert trained on Kuwaiti home standards.
            </p>
            <div className="hidden lg:flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <Info className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                <p className="text-sm text-slate-400">Hani can provide general advice. For final pricing, please request an official site visit.</p>
            </div>
          </div>

          <div className="lg:w-2/3 w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] border-4 border-slate-800/20">
              
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between shadow-sm relative z-20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-gradient-to-tr from-teal-500 to-teal-400 p-2 rounded-full">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Hani AI</h3>
                    <p className="text-xs text-slate-500">Online • Replies instantly</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMessages([])} 
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    Clear Chat
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] ${
                        msg.sender === ChatSender.USER ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === ChatSender.USER ? 'bg-slate-200' : 'bg-teal-100'
                      }`}>
                        {msg.sender === ChatSender.USER ? 
                          <User className="h-4 w-4 text-slate-600" /> : 
                          <Bot className="h-4 w-4 text-teal-600" />
                        }
                      </div>
                      <div
                        className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.sender === ChatSender.USER
                            ? 'bg-slate-900 text-white rounded-tr-sm'
                            : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start animate-pulse">
                      <div className="flex gap-3 max-w-[75%]">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                              <Bot className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-2">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question..."
                        rows={1}
                        className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none max-h-32 min-h-[50px]"
                        disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="h-[50px] w-[50px] flex items-center justify-center bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:scale-95 disabled:hover:bg-teal-600 transition-all shadow-lg shadow-teal-600/20"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;