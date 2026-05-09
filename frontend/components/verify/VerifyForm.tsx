"use client";

import { useState } from "react";
import { useVerification } from "@/hooks/useVerification";
import { useAttestation } from "@/hooks/useAttestation";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { AnalysisResult } from "./AnalysisResult";
import { AttestationCard } from "@/components/blockchain/AttestationCard";
import type { VerifyFormState, VerifyMode } from "@/types";
import { z } from "zod";

export function VerifyForm() {
  const { t } = useT();

  const textSchema = z
    .string()
    .min(20, t.verify.errorMin)
    .max(50000, t.verify.errorMax);
  const urlSchema = z.string().url(t.verify.errorUrl);

  const [mode, setMode] = useState<VerifyMode>("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [includeFactCheck, setIncludeFactCheck] = useState(true);
  const [includeAudioCheck, setIncludeAudioCheck] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { result, isLoading, error, verify, reset } = useVerification();
  const {
    attestation,
    isAnchoring,
    error: attestError,
    anchor,
  } = useAttestation();

  function validate(): boolean {
    setValidationError(null);
    if (mode === "text") {
      const parsed = textSchema.safeParse(content);
      if (!parsed.success) {
        setValidationError(parsed.error.errors[0].message);
        return false;
      }
    } else {
      const parsed = urlSchema.safeParse(url);
      if (!parsed.success) {
        setValidationError(parsed.error.errors[0].message);
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const formState: VerifyFormState = {
      mode,
      content,
      url,
      includeFactCheck,
      includeAudioCheck,
    };

    await verify(formState);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 opacity-0 animate-fade-in-up animate-delay-100"
      >
        <div className="flex gap-px bg-border rounded overflow-hidden w-fit">
          {(["text", "url"] as VerifyMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                reset();
                setValidationError(null);
              }}
              className={`px-6 py-2.5 text-xs font-mono tracking-widest uppercase transition-colors ${
                mode === m
                  ? "bg-signal text-void font-bold"
                  : "bg-surface text-text-muted hover:text-text-primary"
              }`}
            >
              {m === "text" ? t.verify.modeText : t.verify.modeUrl}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest block">
              {t.verify.labelContent}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder={t.verify.placeholderText}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-text-primary font-body placeholder-text-muted resize-none focus:outline-none focus:border-signal/40 transition-colors"
            />
            <p className="text-xs font-mono text-text-muted text-right">
              {content.length} / 50,000
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-muted uppercase tracking-widest block">
              {t.verify.labelUrl}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.verify.placeholderUrl}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-text-primary font-mono placeholder-text-muted focus:outline-none focus:border-signal/40 transition-colors"
            />
          </div>
        )}

        {validationError && (
          <p className="text-xs font-mono text-verdict-critical">
            {validationError}
          </p>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setIncludeFactCheck((v) => !v)}
              className={`w-4 h-4 border rounded-sm transition-colors ${
                includeFactCheck ? "bg-signal border-signal" : "border-border"
              }`}
            />
            <span className="text-xs font-mono text-text-secondary group-hover:text-text-primary transition-colors">
              {t.verify.toggleFactCheck}
            </span>
          </label>
          {mode === "url" && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setIncludeAudioCheck((v) => !v)}
                className={`w-4 h-4 border rounded-sm transition-colors ${
                  includeAudioCheck
                    ? "bg-signal border-signal"
                    : "border-border"
                }`}
              />
              <span className="text-xs font-mono text-text-secondary group-hover:text-text-primary transition-colors">
                {t.verify.toggleAudio}
              </span>
            </label>
          )}
        </div>

        {error && (
          <div className="border border-verdict-critical/30 bg-verdict-critical/5 rounded px-4 py-3">
            <p className="text-xs font-mono text-verdict-critical">{error}</p>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          {isLoading ? t.verify.btnVerifying : t.verify.btnVerify}
        </Button>
      </form>

      {result && (
        <div className="space-y-6">
          <AnalysisResult result={result} />

          {!attestation && (
            <div className="space-y-2">
              {attestError && (
                <p className="text-xs font-mono text-verdict-critical">
                  {attestError}
                </p>
              )}
              <Button
                variant="secondary"
                onClick={() => anchor(result)}
                isLoading={isAnchoring}
                disabled={isAnchoring || !result.ipfs_cid}
              >
                {isAnchoring ? t.result.btnAnchoring : t.result.btnAnchor}
              </Button>
            </div>
          )}

          {attestation && <AttestationCard attestation={attestation} />}
        </div>
      )}
    </div>
  );
}
