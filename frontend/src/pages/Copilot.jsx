import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const EXAMPLES = [
  "What are the latest Edge AI trends?",
  "Which authors work on quantization?",
  "Recommend unexplored research areas based on lineage.",
  "Show lineage and key milestones of Vision Transformers.",
  "Formulate an experiment addressing sparse attention bottlenecks.",
];

export default function Copilot() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Greetings! I am your AI Research Copilot. I analyze your literature graph, synthesize hypotheses, and help formulate rigorous experiment methodologies. How can I accelerate your investigation?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (urlQuery) {
      setQuery(urlQuery);
      ask(urlQuery);
    }
  }, [searchParams]);

  const ask = async (promptOverride) => {
    const textToSend = promptOverride || query;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: textToSend },
    ]);
    setQuery("");
    setLoading(true);

    try {
      const res = await api.get("/copilot", {
        params: { query: textToSend },
      });

      let answer = "";
      if (typeof res.data.response === "string") {
        answer = res.data.response;
      } else {
        answer = JSON.stringify(res.data.response, null, 2);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Unable to contact AI Copilot backend service." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "1050px",
        margin: "0 auto",
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", color: "#f8fafc" }}>
            AI Research Copilot
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Continuous multi-agent dialogue grounded in your lab's knowledge graph
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: "History cleared. Ask any research question.",
              },
            ])
          }
          style={{
            padding: "6px 12px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#94a3b8",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Clear History
        </button>
      </div>

      {/* Suggested prompts row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "6px",
        }}
      >
        {EXAMPLES.map((example, i) => (
          <button
            key={i}
            onClick={() => ask(example)}
            style={{
              padding: "6px 12px",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              color: "#93c5fd",
              borderRadius: "16px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            ✦ {example}
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div
        className="arl-card"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          background: "#0c1322",
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                gap: "10px",
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    flexShrink: 0,
                  }}
                >
                  🚀
                </div>
              )}

              <div
                style={{
                  maxWidth: "75%",
                  padding: "14px 18px",
                  borderRadius: isUser
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: isUser
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "#172136",
                  color: "#f8fafc",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  border: isUser
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>

              {isUser && (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  👤
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              🚀
            </div>
            <div
              style={{
                padding: "12px 18px",
                background: "#172136",
                borderRadius: "16px",
                color: "#94a3b8",
                fontSize: "13px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              Copilot is synthesizing research graph context...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={query}
          placeholder="Ask a research question or request a synthesis... (Enter to send)"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          style={{
            flex: 1,
            padding: "14px 16px",
          }}
        />

        <button
          onClick={() => ask()}
          disabled={loading || !query.trim()}
          style={{
            padding: "0 24px",
            background: "#10b981",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}