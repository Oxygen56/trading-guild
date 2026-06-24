"use client";

import { Send, Slash } from "lucide-react";
import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex-shrink-0 pt-4 border-t border-border-subtle">
      <div className="flex items-end gap-3 bg-bg-card border border-border-default rounded-lg p-3 focus-within:border-border-accent transition-colors duration-fast">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your investment goal... (/help for commands)"
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none min-h-[24px] max-h-[150px]"
        />
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-bg-layer-2 transition-colors duration-fast"
            title="Commands"
          >
            <Slash className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-md bg-accent text-bg-root hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-fast"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
