"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { truncateHash, formatDate } from "@/lib/utils";
import { getIpfsGatewayUrl } from "@/lib/solana";
import { useT } from "@/context/LocaleContext";
import type { AttestationResult } from "@/types";

interface AttestationCardProps {
  attestation: AttestationResult;
}

export function AttestationCard({ attestation }: AttestationCardProps) {
  const { t } = useT();

  return (
    <Card glowing className="animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
            {t.result.onChain}
          </p>
          <Badge
            label={attestation.status}
            variant={attestation.status === "confirmed" ? "signal" : "default"}
          />
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DataRow
            label={t.result.attestationId}
            value={attestation.attestation_id}
            mono
          />
          <DataRow
            label={t.result.created}
            value={formatDate(attestation.created_at)}
          />
          <DataRow
            label={t.result.contentHash}
            value={truncateHash(attestation.content_hash)}
            mono
          />
          <DataRow
            label={t.result.riskScore}
            value={`${Math.round(attestation.risk_score * 100)}%`}
            mono
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {attestation.explorer_url && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(attestation.explorer_url, "_blank")}
            >
              {t.result.viewExplorer}
            </Button>
          )}
          {attestation.ipfs_cid && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                window.open(getIpfsGatewayUrl(attestation.ipfs_cid), "_blank")
              }
            >
              {t.result.viewIpfs}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-muted font-mono uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-sm text-text-primary break-all ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
