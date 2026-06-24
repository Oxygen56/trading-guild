import { AppShell } from "@/components/layout/AppShell";
import { ChatTerminal } from "@/components/terminal/ChatTerminal";

export default function TerminalPage() {
  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">
            Agent Terminal
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Natural language interface — describe your goal, agents execute
          </p>
        </div>

        <ChatTerminal />
      </div>
    </AppShell>
  );
}
