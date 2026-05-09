"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { truncateHash, formatDate } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useT } from "@/context/LocaleContext";
import type { VerificationResult } from "@/types";

export function HistoryTable() {
  const [rows, setRows] = useState<VerificationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useT();

  useEffect(() => {
    apiClient
      .getVerifications()
      .then((data) => setRows(data.verifications))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    t.dashboard.colId,
    t.dashboard.colContent,
    t.dashboard.colRisk,
    t.dashboard.colScore,
    t.dashboard.colIpfs,
    t.dashboard.colAnchored,
    t.dashboard.colDate,
  ];

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
          {t.dashboard.historyTitle}
        </p>
      </CardHeader>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="px-6 py-8 text-xs font-mono text-text-muted">
            {t.dashboard.loading}
          </p>
        ) : rows.length === 0 ? (
          <p className="px-6 py-8 text-xs font-mono text-text-muted">
            {t.dashboard.empty}
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-widest"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.verification_id}
                  className="border-b border-border/50 hover:bg-panel/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-text-muted">
                      {truncateHash(row.verification_id, 4)}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs text-text-secondary truncate">
                      {row.summary?.slice(0, 60) ?? "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={row.risk_level}
                      variant="risk"
                      riskLevel={row.risk_level}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-text-primary">
                      {Math.round(row.risk_score * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-signal">
                      {row.ipfs_cid ? truncateHash(row.ipfs_cid, 6) : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-mono ${
                        row.solana_tx_signature
                          ? "text-verdict-low"
                          : "text-text-muted"
                      }`}
                    >
                      {row.solana_tx_signature
                        ? t.dashboard.yes
                        : t.dashboard.pending}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-text-muted">
                      {formatDate(row.processed_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
