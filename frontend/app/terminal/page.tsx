import TerminalPage from "@/components/terminal/TerminalPage";

export default function TerminalRoutePage() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Agent Terminal
        </h2>
        <p className="text-sm text-text-tertiary mt-1">
          Natural language interface to your trading agents
        </p>
      </div>
      <TerminalPage />
    </div>
  );
}
