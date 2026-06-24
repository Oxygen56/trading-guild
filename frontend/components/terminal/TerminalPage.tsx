"use client";

import { ChatMessage } from "@/lib/types";
import AgentBubble from "@/components/terminal/AgentBubble";
import ChatInput from "@/components/terminal/ChatInput";
import AgentStatusPanel from "@/components/terminal/AgentStatusPanel";
import { mockChatMessages, mockAgents } from "@/lib/mock-data";
import { useState, useRef, useEffect } from "react";

export default function TerminalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      senderName: "You",
      content: text,
      timestamp: "just now",
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-var(--header-height)-3rem)]">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <AgentBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSend={handleSend} />
      </div>

      {/* Right panel */}
      <div className="hidden xl:block w-72 flex-shrink-0">
        <AgentStatusPanel agents={mockAgents} />
      </div>
    </div>
  );
}
