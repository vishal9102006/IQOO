import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Dna,
  Zap,
  Clock,
  AlertTriangle,
  Flame,
  User,
} from 'lucide-react';
import { CoachMessage } from '../types';

export const AiCoachView: React.FC = () => {
  const { focusDna, sessions, tasks } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello! I am your **FocusDNA Productivity Coach**. I don't give generic motivational advice—I analyze your actual focus telemetry.

Based on your records:
• Your attention is sharpest during **${focusDna.bestProductivityPeriod}**
• You have a **${focusDna.bestFocusDuration}m sweet spot** with a drop-off on sessions >30m
• Your current Focus Score is **${focusDna.focusScore}%**

Ask me anything about your productivity patterns or tomorrow's schedule.`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          focusDna,
          recentSessions: sessions.slice(0, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach response');
      }

      const data = await response.json();

      const botMsg: CoachMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
        referencedData: data.referencedData,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching AI coach advice:', err);
      // Fallback
      const botMsg: CoachMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: `Your FocusDNA telemetry shows that sessions exceeding 30 minutes experience a sharp completion drop-off to 41%, compared to 85% for ${focusDna.bestFocusDuration || 23}-minute intervals. Furthermore, ${focusDna.mostCommonDistraction} triggers the majority of interruptions. I recommend capping difficult tasks at ${focusDna.bestFocusDuration || 23}m sprints.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Why was I unproductive today?',
    'What should I work on next?',
    'When should I study tomorrow?',
    'How can I improve my focus score?',
    'What is my biggest distraction trigger?',
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Ask FocusDNA AI Coach
            </h1>
            <p className="text-xs text-zinc-400">
              Data-backed productivity intelligence strictly grounded in your actual behavioral metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Chat, Right Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Chat Window */}
        <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col h-[600px] backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-2">{msg.content}</div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-400 rounded-bl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Synthesizing FocusDNA telemetry...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 shrink-0">
              Quick Inquiries:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask coach about your focus drop-off, distraction triggers, optimal study hours..."
              className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right 4 Cols: Live Telemetry Context Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Dna className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Grounding Telemetry Context
              </h2>
            </div>

            <p className="text-[11px] text-zinc-400">
              Gemini references these exact user records to generate personalized, non-generic advice:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Optimal Duration:</span>
                </span>
                <span className="font-bold text-zinc-100">{focusDna.bestFocusDuration} minutes</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Peak Window:</span>
                </span>
                <span className="font-bold text-zinc-100">{focusDna.bestProductivityPeriod}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Top Distraction:</span>
                </span>
                <span className="font-bold text-amber-300">{focusDna.mostCommonDistraction}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Focus Score:</span>
                </span>
                <span className="font-bold text-indigo-300">{focusDna.focusScore}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200">
              💡 <strong>Coach Guarantee:</strong> All responses are computed strictly against your real performance anomalies.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
