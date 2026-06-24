"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { AgentBubble } from "./AgentBubble";
import { mockChatMessages, mockAgents } from "@/lib/mock-data";
import { ActiveAgentsPanel } from "./ActiveAgentsPanel";

export function ChatTerminal() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: "You",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate agent response (mock mode)
    setTimeout(() => {
      const responseMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "strategy",
        senderName: "Athena",
        content:
          "I received your request. Let me analyze the current market conditions and find the best strategy for you. This would typically involve:\n\n• Scanning CSPR.trade liquidity pools\n• Checking price feeds across DEXs\n• Running risk assessment models\n\nIn production, this connects to the Strategy Agent backend via SSE for real-time streaming.",
        timestamp: new Date(Date.now() + 2000).toISOString(),
      };
      setMessages((prev) => [...prev, responseMsg]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 min-h-[calc(100vh-180px)]">
      {/* Chat Area */}
      <div className="flex flex-col bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          <div className="space-y-1">
            {messages.map((msg) => (
              <AgentBubble key={msg.id} message={msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-end gap-3 bg-bg-input border border-border-default rounded-xl px-4 py-3 focus-within:border-border-accent transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your investment goal... (e.g. I want to invest 1000 CSPR in low-risk strategies)"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-tertiary resize-none outline-none min-h-[24px] max-h-[120px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 p-2 rounded-lg bg-accent text-text-on-accent hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-text-tertiary mt-2 px-2">
            Try: /status /history /help · Press Enter to send
          </p>
        </div>
      </div>

      {/* Right Panel — Active Agents */}
      <div className="space-y-4">
        <ActiveAgentsPanel agents={mockAgents} />
      </div>
    </div>
  );
}
