import { useState } from "react";
import ReactMarkdown from "react-markdown";

// Removes ANSI color codes from trace logs
function stripAnsi(input: string): string {
  return input.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

function prettifyTrace(trace: string): string {
  const clean = stripAnsi(trace);

  return clean
    .replace(/> Entering new .*?chain\.\.\./g, "")
    .replace(/> Finished chain\./g, "")
    .replace(/Thought:/g, "**🤔 Thought:** ")
    .replace(/Action Input:/g, "**🔢 Action Input:** ")
    .replace(/Action:/g, "**⚙️ Action:** ")
    .replace(/Observation:/g, "**📊 Observation:** ")
    .replace(/Final Answer:/g, "**✅ Final Answer:** ")
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
        {isOpen
          ? "🧠 Collapse Agent's Reasoning"
          : "🧠 See How Agent Figured It Out"}
      </button>

      {isOpen && (
        <div className="text-xs mt-2 text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none italic">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
