"use client";

type Props = { message?: string };

export default function RouteOverlay({ message = "Dibujando ruta…" }: Props) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Cargando ruta"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "grid",
                placeItems: "center",
                zIndex: 10000,
            }}
        >
            <div
                style={{
                    background: "#111827",
                    color: "#fff",
                    padding: "14px 18px",
                    borderRadius: 12,
                    minWidth: 260,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    boxShadow: "0 20px 50px rgba(0,0,0,.5)",
                }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2" />
                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                <div style={{ fontWeight: 700 }}>{message}</div>
            </div>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
