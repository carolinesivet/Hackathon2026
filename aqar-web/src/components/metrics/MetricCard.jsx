import { useState } from "react";
import TableForm from "./TableForm";

export default function MetricCard({
  metric,
  response,
  color,
  onChange,
  onSave,
  readOnly = false,
}) {
  const [open, setOpen] = useState(false);

  const isDone = response?.rows?.length > 0;
  const rowCount = response?.rows?.length || 0;

  return (
    <div
      style={{
        background: "#0a1520",
        border: `1px solid ${open ? color + "50" : isDone ? "#1a3a1a" : "#1e293b"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color .2s",
      }}
    >
      {/* Header row */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          cursor: "pointer",
          background: open ? `${color}08` : "transparent",
          userSelect: "none",
        }}
      >
        {/* Status dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            flexShrink: 0,
            background: isDone ? "#22c55e" : "#334155",
            boxShadow: isDone ? "0 0 6px #22c55e80" : "none",
          }}
        />

        {readOnly && (
          <span style={{ fontSize: 11, color: "#475569", flexShrink: 0 }}>
            🔒
          </span>
        )}

        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 700,
            background: `${color}15`,
            color,
            border: `1px solid ${color}30`,
            borderRadius: 5,
            padding: "2px 8px",
            flexShrink: 0,
          }}
        >
          {metric.id}
        </span>

        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: open ? "#f1f5f9" : "#94a3b8",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: open ? 600 : 400,
          }}
        >
          {metric.title}
        </span>

        {/* Record count pill */}
        {rowCount > 0 && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              background: "#14532d",
              color: "#4ade80",
              borderRadius: 10,
              padding: "2px 8px",
            }}
          >
            {rowCount} row{rowCount !== 1 ? "s" : ""}
          </span>
        )}

        <span
          style={{
            fontSize: 10,
            color: "#334155",
            fontFamily: "monospace",
            marginRight: 4,
          }}
        >
          {metric.columns.length} cols
        </span>

        <span
          style={{
            fontSize: 10,
            color: "#475569",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        >
          ▼
        </span>
      </div>

      {/* Expandable body */}
      {open && (
        <div
          style={{ padding: "0 18px 18px", borderTop: `1px solid ${color}20` }}
        >
          {/* Column hint chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              padding: "10px 0 14px",
            }}
          >
            {metric.columns.map((c) => (
              <span
                key={c.key}
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  background: "#0f172a",
                  color: c.required ? "#a78bfa" : "#475569",
                  border: `1px solid ${c.required ? "#4c1d9540" : "#1e293b"}`,
                  borderRadius: 4,
                  padding: "1px 7px",
                }}
              >
                {c.key}
                {c.required ? " *" : ""}
              </span>
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#334155",
              marginBottom: 10,
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#a78bfa" }}>* required field</span>
          </div>
          <TableForm
            metric={metric}
            response={response}
            onChange={onChange}
            onSave={onSave}
            color={color}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
}
