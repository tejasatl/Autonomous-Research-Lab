import { useState, useRef, useEffect } from "react";
import api from "../services/api";

const SUGGESTIONS = [
  "What are the major open research gaps in current literature?",
  "Analyze trade-offs between sparse attention and linear attention.",
  "Which author groups are leading multi-agent LLM reasoning?",
  "Generate a research hypothesis combining Graph Neural Networks with LLMs.",
];

export default function Chat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your GraphRAG Research Assistant. I query our indexed knowledge graph, paper vector embeddings, and citation chains to answer deep scientific questions. What would you like to explore today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(promptText) {
    const textToSend = promptText || query;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await api.get("/ask", {
        params: { query: textToSend },
      });

      const responseText =
        typeof res.data?.response === "string"
          ? res.data.response
          : JSON.stringify(res.data?.response || res.data, null, 2);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseText || "No response received from the GraphRAG service.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Error querying GraphRAG backend. Please verify backend connection.",
        },
      ]);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", color: "#f8fafc" }}>
            GraphRAG Knowledge Chat
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Hybrid vector retrieval + knowledge graph contextual querying
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content:
                  "Conversation cleared. Ask any question about your indexed papers or lineage.",
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
          paddingBottom: "10px",
          marginBottom: "8px",
        }}
      >
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(suggestion)}
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
            ✦ {suggestion}
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
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  ⚡
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
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              ⚡
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
              Querying GraphRAG & vector index...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "16px",
        }}
      >
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask GraphRAG anything about your research papers, lineage, or concepts... (Enter to send, Shift+Enter for new line)"
          style={{
            flex: 1,
            padding: "12px 16px",
            resize: "none",
          }}
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !query.trim()}
          style={{
            padding: "0 24px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Send ↵
        </button>
      </div>
    </div>
  );
}