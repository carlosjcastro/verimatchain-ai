"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { truncateHash } from "@/lib/utils";
import { getIpfsGatewayUrl, getExplorerUrl } from "@/lib/solana";
import { useT } from "@/context/LocaleContext";
import type { VerificationResult } from "@/types";

interface EvidencePanelProps {
  result: VerificationResult;
}

export function EvidencePanel({ result }: EvidencePanelProps) {
  const { t } = useT();

  return (
    <div className="space-y-4">
      {result.bias_indicators.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              {t.result.biasIndicators}
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            {result.bias_indicators.map((bias, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-signal">{bias.type}</p>
                  <p className="text-xs font-mono text-text-muted">
                    {Math.round(bias.severity * 100)}%
                  </p>
                </div>
                <Progress
                  value={bias.severity}
                  colorClass={
                    bias.severity > 0.7
                      ? "bg-verdict-high"
                      : bias.severity > 0.4
                        ? "bg-verdict-medium"
                        : "bg-signal"
                  }
                />
                <p className="text-xs text-text-secondary">
                  {bias.description}
                </p>
                {bias.excerpt && (
                  <blockquote className="border-l-2 border-signal/30 pl-3 text-xs font-mono text-text-muted italic">
                    {bias.excerpt}
                  </blockquote>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {result.fact_check_claims.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              {t.result.factCheck}
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            {result.fact_check_claims.map((claim, idx) => (
              <div
                key={idx}
                className="border border-border rounded p-3 space-y-1.5"
              >
                <p className="text-xs text-text-secondary">{claim.claim}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-signal font-bold">
                    {claim.rating}
                  </span>
                  <span className="text-xs text-text-muted">
                    {claim.publisher}
                  </span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {result.audio_analysis && (
        <Card>
          <CardHeader>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              {t.result.audioForensics}
            </p>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                {t.result.syntheticSpeech}
              </p>
              <span
                className={`text-sm font-mono font-bold ${
                  result.audio_analysis.is_synthetic
                    ? "text-verdict-critical"
                    : "text-verdict-low"
                }`}
              >
                {result.audio_analysis.is_synthetic
                  ? t.result.detected
                  : t.result.clean}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-text-muted">
                <span>{t.result.ttsProbability}</span>
                <span>
                  {Math.round(result.audio_analysis.tts_probability * 100)}%
                </span>
              </div>
              <Progress
                value={result.audio_analysis.tts_probability}
                colorClass="bg-verdict-high"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-text-muted">
                <span>{t.result.cloningProbability}</span>
                <span>
                  {Math.round(result.audio_analysis.cloning_probability * 100)}%
                </span>
              </div>
              <Progress
                value={result.audio_analysis.cloning_probability}
                colorClass="bg-verdict-critical"
              />
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
            {t.result.chainOfCustody}
          </p>
        </CardHeader>
        <CardBody className="space-y-3">
          <ChainRow
            label={t.result.verificationId}
            value={truncateHash(result.verification_id)}
          />
          <ChainRow
            label={t.result.contentHash}
            value={truncateHash(result.content_hash)}
          />
          {result.ipfs_cid && (
            <ChainRow
              label={t.result.ipfsCid}
              value={truncateHash(result.ipfs_cid)}
              href={getIpfsGatewayUrl(result.ipfs_cid)}
            />
          )}
          {result.solana_tx_signature && (
            <ChainRow
              label={t.result.solanaTx}
              value={truncateHash(result.solana_tx_signature)}
              href={getExplorerUrl(result.solana_tx_signature)}
            />
          )}
          {result.on_chain_hash && (
            <ChainRow
              label={t.result.anchorHash}
              value={truncateHash(result.on_chain_hash)}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function ChainRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs text-text-muted shrink-0">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-signal hover:underline truncate"
        >
          {value}
        </a>
      ) : (
        <p className="text-xs font-mono text-text-secondary truncate">
          {value}
        </p>
      )}
    </div>
  );
}
