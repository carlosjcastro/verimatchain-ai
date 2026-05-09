"use client";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskScore } from "./RiskScore";
import { EvidencePanel } from "./EvidencePanel";
import { getRiskBgColor } from "@/lib/utils";
import type { VerificationResult } from "@/types";

interface AnalysisResultProps {
  result: VerificationResult;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6 opacity-0 animate-fade-in-up animate-delay-200">
      <Card glowing className={getRiskBgColor(result.risk_level)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Analysis Complete
            </p>
            <Badge
              label={result.risk_level}
              variant="risk"
              riskLevel={result.risk_level}
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <RiskScore score={result.risk_score} level={result.risk_level} />
            <div className="space-y-3 flex-1">
              <p className="text-sm text-text-primary leading-relaxed">
                {result.summary}
              </p>
              {result.missing_sources.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                    Missing Sources
                  </p>
                  <ul className="space-y-1">
                    {result.missing_sources.map((src, i) => (
                      <li
                        key={i}
                        className="text-xs text-text-secondary flex items-start gap-2"
                      >
                        <span className="text-verdict-medium mt-0.5">-</span>
                        {src}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {result.explainability && (
        <Card>
          <CardHeader>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Explainable AI - Reasoning
            </p>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-text-secondary leading-relaxed">
              {result.explainability}
            </p>
          </CardBody>
        </Card>
      )}

      <EvidencePanel result={result} />
    </div>
  );
}
