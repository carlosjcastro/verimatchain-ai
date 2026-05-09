"use client";

import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useT } from "@/context/LocaleContext";

export default function DocsPage() {
  const { t } = useT();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="mb-12 space-y-2">
          <p className="text-xs font-mono text-signal uppercase tracking-widest">
            {t.nav.docs}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text-primary">
            VeriMatChain AI Docs
          </h1>
          <p className="text-text-secondary text-base max-w-xl">
            Technical reference for the verification pipeline, blockchain
            integration, and API endpoints.
          </p>
        </div>

        <div className="space-y-16">
          <Section id="overview" title="Overview">
            <p>
              VeriMatChain AI is a multimodal information integrity system that
              combines AI analysis with blockchain immutability. Every
              verification runs through a deterministic pipeline that produces a
              tamper-proof audit trail anchored on Solana Devnet.
            </p>
            <FlowDiagram />
          </Section>

          <Section id="pipeline" title="Verification Pipeline">
            <p>
              Each verification request goes through six sequential stages.
              Every stage is implemented as a LangGraph node with a single
              responsibility following the SRP principle.
            </p>
            <div className="mt-6 space-y-3">
              {PIPELINE_STEPS.map((step, i) => (
                <PipelineStep
                  key={i}
                  number={i + 1}
                  title={step.title}
                  description={step.description}
                  tech={step.tech}
                />
              ))}
            </div>
          </Section>

          <Section id="api" title="API Reference">
            <p>
              The backend exposes a REST API at{" "}
              <code className="font-mono text-xs bg-panel px-1.5 py-0.5 rounded text-signal">
                http://localhost:8000
              </code>
              . Full interactive docs are available at{" "}
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:underline font-mono text-xs"
              >
                /docs
              </a>
              .
            </p>
            <div className="mt-6 space-y-4">
              {API_ENDPOINTS.map((endpoint, i) => (
                <EndpointCard
                  key={i}
                  method={endpoint.method}
                  path={endpoint.path}
                  description={endpoint.description}
                  body={endpoint.body}
                />
              ))}
            </div>
          </Section>

          <Section id="risk-levels" title="Risk Levels">
            <p>
              Claude assigns a risk score between 0.0 and 1.0 based on detected
              bias patterns, missing sources, and cross-referenced fact-check
              evidence. The score maps to four levels.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RISK_LEVELS.map((level) => (
                <RiskCard
                  key={level.label}
                  label={level.label}
                  range={level.range}
                  description={level.description}
                  colorClass={level.colorClass}
                />
              ))}
            </div>
          </Section>

          <Section id="blockchain" title="Blockchain Integration">
            <p>
              Attestations are stored on-chain via a Solana Anchor program using
              Program Derived Addresses. Each attestation is seeded by the
              verification ID, making it deterministically retrievable without
              storing an index.
            </p>
            <div className="mt-6 space-y-4">
              {BLOCKCHAIN_STEPS.map((step, i) => (
                <CodeBlock key={i} label={step.label} code={step.code} />
              ))}
            </div>
          </Section>

          <Section id="env" title="Environment Variables">
            <p>
              All secrets are loaded via{" "}
              <code className="font-mono text-xs bg-panel px-1.5 py-0.5 rounded text-signal">
                pydantic-settings
              </code>{" "}
              from the{" "}
              <code className="font-mono text-xs bg-panel px-1.5 py-0.5 rounded text-signal">
                backend/.env
              </code>{" "}
              file. None are exposed to the frontend.
            </p>
            <div className="mt-6 space-y-2">
              {ENV_VARS.map((v) => (
                <EnvRow
                  key={v.envKey}
                  envKey={v.envKey}
                  description={v.description}
                  required={v.required}
                  requiredLabel={t.nav.docs === "Docs" ? "required" : "requerido"}
                  optionalLabel={t.nav.docs === "Docs" ? "optional" : "opcional"}
                />
              ))}
            </div>
          </Section>

          <Section id="stack" title="Tech Stack">
            <p>
              The architecture follows a hybrid on-chain/off-chain model. Heavy
              AI processing runs off-chain while only the irreducible truth
              (hashes, certificates, verifier signatures) is stored on-chain to
              minimize transaction costs and latency.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded overflow-hidden">
              {STACK_LAYERS.map((layer) => (
                <div
                  key={layer.layer}
                  className="bg-surface px-6 py-5 space-y-3"
                >
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                    {layer.layer}
                  </p>
                  <ul className="space-y-1.5">
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-text-secondary flex items-start gap-2"
                      >
                        <span className="text-signal mt-1 shrink-0">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-px h-6 bg-signal" />
        <h2 className="font-display text-xl font-bold text-text-primary">
          {title}
        </h2>
      </div>
      <div className="text-text-secondary text-sm leading-relaxed space-y-4 pl-4">
        {children}
      </div>
    </section>
  );
}

function FlowDiagram() {
  const steps = ["Input", "Hash", "Fact-Check RAG", "Claude AI", "IPFS", "Solana"];
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className="bg-panel border border-border px-3 py-1.5 rounded text-xs font-mono text-signal">
            {step}
          </div>
          {i < steps.length - 1 && (
            <span className="text-text-muted font-mono text-xs">{">"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function PipelineStep({
  number,
  title,
  description,
  tech,
}: {
  number: number;
  title: string;
  description: string;
  tech: string;
}) {
  return (
    <div className="flex gap-4 bg-surface border border-border rounded p-4">
      <div className="w-7 h-7 rounded-sm bg-signal/10 border border-signal/20 flex items-center justify-center shrink-0">
        <span className="text-xs font-mono font-bold text-signal">{number}</span>
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-mono text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary">{description}</p>
        <p className="text-xs font-mono text-text-muted">{tech}</p>
      </div>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  description,
  body,
}: {
  method: string;
  path: string;
  description: string;
  body?: string;
}) {
  const methodColors: Record<string, string> = {
    POST: "text-verdict-medium bg-verdict-medium/10 border-verdict-medium/30",
    GET: "text-verdict-low bg-verdict-low/10 border-verdict-low/30",
  };
  return (
    <div className="bg-surface border border-border rounded p-4 space-y-2">
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
            methodColors[method] ?? ""
          }`}
        >
          {method}
        </span>
        <code className="text-xs font-mono text-signal">{path}</code>
      </div>
      <p className="text-xs text-text-secondary">{description}</p>
      {body && (
        <pre className="bg-abyss border border-border rounded p-3 text-xs font-mono text-text-secondary overflow-x-auto">
          {body}
        </pre>
      )}
    </div>
  );
}

function RiskCard({
  label,
  range,
  description,
  colorClass,
}: {
  label: string;
  range: string;
  description: string;
  colorClass: string;
}) {
  return (
    <div className={`rounded border p-4 space-y-1 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-mono font-bold">{label}</p>
        <p className="text-xs font-mono opacity-70">{range}</p>
      </div>
      <p className="text-xs opacity-80">{description}</p>
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
        {label}
      </p>
      <pre className="bg-abyss border border-border rounded p-3 text-xs font-mono text-text-secondary overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

function EnvRow({
  envKey,
  description,
  required,
  requiredLabel,
  optionalLabel,
}: {
  envKey: string;
  description: string;
  required: boolean;
  requiredLabel: string;
  optionalLabel: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-surface border border-border rounded px-4 py-3">
      <code className="text-xs font-mono text-signal shrink-0 w-56">
        {envKey}
      </code>
      <p className="text-xs text-text-secondary flex-1">{description}</p>
      <span
        className={`text-xs font-mono shrink-0 ${
          required ? "text-verdict-high" : "text-text-muted"
        }`}
      >
        {required ? requiredLabel : optionalLabel}
      </span>
    </div>
  );
}

const PIPELINE_STEPS = [
  {
    title: "Content ingestion",
    description:
      "Raw text or URL is received. URLs are fetched and cleaned with BeautifulSoup, stripping scripts, nav, footer and ads.",
    tech: "utils/content_extractor.py",
  },
  {
    title: "SHA-256 hashing",
    description:
      "Content is normalized (lowercased, stripped) and hashed to produce a deterministic 64-char content fingerprint.",
    tech: "utils/hashing.py -> compute_content_hash()",
  },
  {
    title: "Fact-Check RAG",
    description:
      "Google Fact Check Tools API is queried with the first 300 chars of content to retrieve real-world claim ratings as context.",
    tech: "services/fact_check_service.py -> search_claims()",
  },
  {
    title: "Claude analysis",
    description:
      "Claude receives content plus fact-check evidence and returns structured JSON with risk score, bias indicators, missing sources, and explainability.",
    tech: "services/claude_service.py -> analyze_content()",
  },
  {
    title: "IPFS pinning",
    description:
      "Full evidence JSON is pinned to IPFS via Pinata with CID v1. Returns a content identifier that cannot be deleted by any third party.",
    tech: "services/pinata_service.py -> pin_verification_evidence()",
  },
  {
    title: "Solana attestation",
    description:
      "Anchor hash combining verification_id, risk_score, and ipfs_cid is anchored on-chain via a PDA account on Solana Devnet.",
    tech: "services/solana_service.py -> anchor_attestation()",
  },
];

const API_ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/verify/text",
    description:
      "Analyze raw text content. Runs the full pipeline: hashing, Fact-Check RAG, Claude, IPFS, and Solana.",
    body: `{
  "content": "string (20-50000 chars)",
  "include_fact_check": true,
  "language": "es"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/verify/url",
    description:
      "Fetch and analyze content from a URL. Optionally includes ElevenLabs audio classification.",
    body: `{
  "url": "https://example.com/article",
  "include_fact_check": true,
  "include_audio_check": false
}`,
  },
  {
    method: "POST",
    path: "/api/v1/audio/classify",
    description:
      "Submit an audio URL to ElevenLabs AI Speech Classifier. Returns TTS and voice cloning probability.",
    body: `{
  "audio_url": "https://example.com/audio.mp3"
}`,
  },
  {
    method: "POST",
    path: "/api/v1/attestation/create",
    description:
      "Anchor a verification result on-chain manually. Returns the Solana transaction signature and Devnet explorer URL.",
    body: `{
  "verification_id": "string",
  "content_hash": "string (64 chars)",
  "risk_score": 0.72,
  "ipfs_cid": "string",
  "wallet_address": "string"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/history/verifications",
    description:
      "Returns all verifications stored in memory for the current session, ordered newest first.",
    body: undefined,
  },
  {
    method: "GET",
    path: "/api/v1/history/stats",
    description:
      "Returns aggregate stats: total verifications, high risk count, anchored count, and synthetic audio count.",
    body: undefined,
  },
];

const RISK_LEVELS = [
  {
    label: "Low",
    range: "0.0 - 0.29",
    description:
      "Content appears reliable. Minor caveats may apply. Safe to share with appropriate context.",
    colorClass: "bg-verdict-low/10 border-verdict-low/30 text-verdict-low",
  },
  {
    label: "Medium",
    range: "0.30 - 0.59",
    description:
      "Potential biases detected. Verify primary sources independently before sharing.",
    colorClass:
      "bg-verdict-medium/10 border-verdict-medium/30 text-verdict-medium",
  },
  {
    label: "High",
    range: "0.60 - 0.79",
    description:
      "Significant integrity issues. Missing sources, strong framing bias, or unverified claims.",
    colorClass: "bg-verdict-high/10 border-verdict-high/30 text-verdict-high",
  },
  {
    label: "Critical",
    range: "0.80 - 1.0",
    description:
      "Disinformation patterns detected. Content contradicts verified fact-check sources.",
    colorClass:
      "bg-verdict-critical/10 border-verdict-critical/30 text-verdict-critical",
  },
];

const BLOCKCHAIN_STEPS = [
  {
    label: "PDA seed derivation",
    code: `seeds = [b"attestation", verification_id.encode("utf-8")[:32]]
pda, bump = Pubkey.find_program_address(seeds, program_id)`,
  },
  {
    label: "On-chain account fields",
    code: `pub struct Attestation {
    pub verification_id: String,  // max 64 chars
    pub content_hash:    String,  // SHA-256 hex (64 chars)
    pub risk_score:      f64,     // 0.0 - 1.0
    pub ipfs_cid:        String,  // IPFS CID v1 (max 64 chars)
    pub wallet_address:  String,  // Solana pubkey (max 44 chars)
    pub authority:       Pubkey,  // backend agent wallet
    pub created_at:      i64,     // unix timestamp
    pub bump:            u8,      // PDA bump seed
}`,
  },
  {
    label: "Devnet explorer URL format",
    code: `https://explorer.solana.com/tx/{signature}?cluster=devnet`,
  },
];

const ENV_VARS = [
  {
    envKey: "ANTHROPIC_API_KEY",
    description: "Anthropic Console API key for Claude analysis.",
    required: true,
  },
  {
    envKey: "ELEVENLABS_API_KEY",
    description: "ElevenLabs API key for the AI Speech Classifier endpoint.",
    required: true,
  },
  {
    envKey: "PINATA_JWT",
    description: "Pinata JWT bearer token used for pinJSONToIPFS requests.",
    required: true,
  },
  {
    envKey: "PINATA_API_KEY",
    description: "Pinata API key, used alongside the JWT for some endpoints.",
    required: true,
  },
  {
    envKey: "PINATA_API_SECRET",
    description: "Pinata API secret.",
    required: true,
  },
  {
    envKey: "GOOGLE_FACT_CHECK_API_KEY",
    description: "Google Cloud API key with the Fact Check Tools API enabled.",
    required: true,
  },
  {
    envKey: "SOLANA_RPC_URL",
    description: "Solana RPC endpoint. Defaults to https://api.devnet.solana.com.",
    required: false,
  },
  {
    envKey: "SOLANA_PROGRAM_ID",
    description: "Deployed Anchor program public key on Solana Devnet.",
    required: true,
  },
  {
    envKey: "AGENT_WALLET_PRIVATE_KEY",
    description:
      "64-byte keypair array for the backend signing wallet. Must have SOL for transaction fees.",
    required: true,
  },
  {
    envKey: "CORS_ORIGINS",
    description: "Allowed origin for CORS. Defaults to http://localhost:3000.",
    required: false,
  },
];

const STACK_LAYERS = [
  {
    layer: "Frontend",
    items: [
      "Next.js 15 (App Router)",
      "React 19",
      "Tailwind CSS v3",
      "Solana Wallet Adapter",
      "Zod validation",
    ],
  },
  {
    layer: "Backend",
    items: [
      "FastAPI + Uvicorn",
      "LangGraph orchestration",
      "Anthropic Claude",
      "ElevenLabs Classifier",
      "Pinata IPFS",
    ],
  },
  {
    layer: "Blockchain",
    items: [
      "Solana Devnet",
      "Anchor framework",
      "Rust smart contract",
      "PDA attestations",
      "Solana Explorer",
    ],
  },
];