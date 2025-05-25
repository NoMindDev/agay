import { useState } from "react";
import ReactMarkdown from "react-markdown";

function stripAnsi(input: string): string {
  return input.replace(
    // Regex to remove ANSI escape codes
    /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g,
    ""
  );
}

function prettifyTrace(trace: string): string {
  const clean = stripAnsi(trace);
  return clean
    .replace(/> Entering new .*?chain\.\.\./g, "")
    .replace(/> Finished chain\./g, "")
    .replace(/Thought:/g, "**🤔 Thought:**")
    .replace(/Action:/g, "**⚙️ Action:**")
    .replace(/Action Input:/g, "**🔢 Action Input:**")
    .replace(/Observation:/g, "**📊 Observation:**")
    .replace(/Final Answer:/g, "**✅ Final Answer:**")
    .trim();
}

export default function TraceViewer({ trace }: { trace: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace) return null;

  const markdown = prettifyTrace(trace);

  return (
    <div className="text-sm pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 font-medium hover:underline focus:outline-none"
      >
        {isOpen ? "Hide Reasoning ▲" : "Show Reasoning ▼"}
      </button>

      {isOpen && (
        <div className="mt-2 text-gray-500">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
