# VeriMatChain AI

<p align="center">
  <strong>Multimodal AI Verification Infrastructure with Immutable Blockchain Attestations</strong>
</p>

<p align="center">
  AI-powered content integrity analysis, decentralized evidence preservation, and on-chain verification certificates built on Solana.
</p>

---

## Overview

VeriMatChain AI is a multimodal verification platform designed to address one of the most critical problems of the modern digital ecosystem: the accelerated spread of manipulated, misleading, and unverifiable information.

The project combines artificial intelligence, retrieval-augmented verification pipelines, decentralized storage, and blockchain attestations to create a verifiable chain of integrity for digital content. Instead of relying solely on probabilistic AI outputs, VeriMatChain AI produces cryptographically anchored verification evidence that can be independently audited and validated.

Each verification request generates a deterministic audit trail composed of:

- a normalized SHA-256 content fingerprint,
- contextual fact-check evidence,
- structured AI integrity analysis,
- decentralized IPFS evidence storage,
- and immutable Solana blockchain attestations.

The platform follows a hybrid architecture in which computationally intensive AI operations remain off-chain while only irreducible proof artifacts are stored on-chain, significantly reducing latency and transaction costs without sacrificing verifiability.

---

# Why VeriMatChain AI Exists

The current information landscape is increasingly affected by:

- AI-generated misinformation,
- synthetic audio and voice cloning,
- manipulated narratives,
- unverifiable viral content,
- and rapidly distributed disinformation campaigns.

Traditional verification systems often lack transparency, immutability, or explainability. VeriMatChain AI was designed to bridge that gap by combining semantic AI reasoning with blockchain-backed evidence preservation.

The goal is not merely to classify information as “true” or “false”, but to provide transparent integrity analysis supported by verifiable evidence and permanent attestations.

---

# System Architecture

The verification workflow follows a deterministic multi-stage pipeline:

```txt
Input
   ↓
SHA-256 Hashing
   ↓
Fact-Check Retrieval (RAG)
   ↓
Claude AI Integrity Analysis
   ↓
IPFS Evidence Pinning
   ↓
Solana Blockchain Attestation
```

Each stage is isolated as an independent LangGraph node following the Single Responsibility Principle (SRP), allowing the pipeline to remain modular, observable, and extensible.

---

# Verification Pipeline

## Content Ingestion

The pipeline begins by receiving either raw text or a public URL. When URLs are provided, the system extracts and sanitizes the content using BeautifulSoup, removing scripts, advertisements, navigation elements, and irrelevant markup in order to preserve only meaningful semantic content.

This normalization stage is critical to ensuring deterministic hashing and reducing contextual noise before AI analysis.

```python
utils/content_extractor.py
```

---

## SHA-256 Content Fingerprinting

After normalization, the content is transformed into a deterministic SHA-256 hash. This fingerprint acts as the immutable identity of the analyzed material and enables future integrity verification without exposing the original content itself.

```python
utils/hashing.py -> compute_content_hash()
```

The generated hash is:

- deterministic,
- collision resistant,
- immutable,
- and cryptographically verifiable.

---

## Fact-Check Retrieval (RAG)

To provide contextual grounding, VeriMatChain AI integrates Retrieval-Augmented Generation using the Google Fact Check Tools API.

The system extracts semantic context from the content and retrieves existing fact-check claims that may be relevant to the analyzed material.

```python
services/fact_check_service.py -> search_claims()
```

These references are injected into the AI reasoning stage to reduce hallucinations and improve contextual reliability.

---

## Claude AI Integrity Analysis

Claude performs structured semantic analysis over the normalized content and retrieved evidence.

Rather than generating simplistic binary classifications, the model evaluates:

- framing bias,
- manipulative rhetoric,
- missing attribution,
- unverifiable claims,
- source reliability,
- and contextual inconsistencies.

```python
services/claude_service.py -> analyze_content()
```

The analysis produces structured JSON output containing:

```json
{
  "risk_score": 0.72,
  "risk_level": "high",
  "bias_indicators": [],
  "missing_sources": [],
  "explanation": "..."
}
```

The resulting risk score ranges from `0.0` to `1.0` and represents the estimated informational integrity risk associated with the content.

---

## IPFS Evidence Preservation

Once the analysis is completed, the full verification evidence package is pinned to IPFS through Pinata.

```python
services/pinata_service.py -> pin_verification_evidence()
```

The stored evidence includes:

- AI analysis results,
- contextual fact-check references,
- metadata,
- timestamps,
- content fingerprints,
- and verification identifiers.

By storing evidence on IPFS, the platform ensures that verification artifacts remain decentralized, tamper-resistant, and independently retrievable.

---

## Solana Blockchain Attestation

The final stage anchors the verification certificate on Solana Devnet using Program Derived Addresses (PDAs).

```python
services/solana_service.py -> anchor_attestation()
```

Each attestation contains:

- the verification identifier,
- the SHA-256 content hash,
- the calculated risk score,
- the IPFS CID,
- and the verifier wallet signature.

This design enables immutable proof generation while maintaining extremely low operational costs and high throughput.

---

# Risk Classification Model

VeriMatChain AI uses a probabilistic integrity scoring model ranging from `0.0` to `1.0`.

| Risk Level | Range | Interpretation |
|---|---|---|
| Low | 0.00 – 0.29 | Content appears contextually reliable with minor caveats |
| Medium | 0.30 – 0.59 | Potential framing bias or missing verification sources detected |
| High | 0.60 – 0.79 | Significant integrity concerns or unsupported claims identified |
| Critical | 0.80 – 1.00 | Strong disinformation indicators or contradictions against verified evidence |

The scoring system is designed as an assistive integrity signal rather than an absolute truth engine.

---

# API Overview

The backend exposes a REST API built with FastAPI.

Base URL:

```txt
http://localhost:8000
```

Interactive documentation:

```txt
/docs
```

---

## Main Endpoints

### `POST /api/v1/verify/text`

Runs the full verification pipeline against raw text input.

```json
{
  "content": "string (20-50000 chars)",
  "include_fact_check": true,
  "language": "es"
}
```

---

### `POST /api/v1/verify/url`

Fetches and analyzes content directly from a URL.

```json
{
  "url": "https://example.com/article",
  "include_fact_check": true,
  "include_audio_check": false
}
```

---

### `POST /api/v1/audio/classify`

Uses ElevenLabs AI Speech Classifier for synthetic audio detection.

```json
{
  "audio_url": "https://example.com/audio.mp3"
}
```

---

### `POST /api/v1/attestation/create`

Creates a blockchain attestation manually.

```json
{
  "verification_id": "string",
  "content_hash": "string",
  "risk_score": 0.72,
  "ipfs_cid": "string",
  "wallet_address": "string"
}
```

---

# Blockchain Design

VeriMatChain AI uses Solana Program Derived Addresses (PDAs) to store attestations deterministically without maintaining centralized indexes.

PDA derivation:

```rust
seeds = [b"attestation", verification_id.encode("utf-8")[:32]]
pda, bump = Pubkey.find_program_address(seeds, program_id)
```

Attestation structure:

```rust
pub struct Attestation {
    pub verification_id: String,
    pub content_hash:    String,
    pub risk_score:      f64,
    pub ipfs_cid:        String,
    pub wallet_address:  String,
    pub authority:       Pubkey,
    pub created_at:      i64,
    pub bump:            u8,
}
```

The architecture minimizes blockchain storage requirements by storing only irreducible proof artifacts on-chain while maintaining full verification evidence off-chain through IPFS.

---

# Technology Stack

## Frontend

The frontend is built using Next.js 15 and React 19 with a modern App Router architecture. Tailwind CSS is used for styling, while Zod provides runtime validation and type-safe schemas.

---

## Backend

The backend is implemented with FastAPI and orchestrated using LangGraph. Claude powers the semantic reasoning layer, while auxiliary services integrate external verification and evidence infrastructure.

---

## Blockchain Layer

The blockchain layer is built on Solana Devnet using the Anchor framework and Rust smart contracts for deterministic attestation storage.

---

# Local Development

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
# Windows:
# venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Security and Design Principles

VeriMatChain AI follows a hybrid on-chain/off-chain architecture intentionally designed for scalability and auditability.

Heavy AI operations remain off-chain to reduce computational overhead and blockchain costs, while immutable cryptographic proof artifacts are stored on-chain to guarantee long-term integrity verification.

The system prioritizes:

- transparency,
- explainability,
- decentralization,
- deterministic verification,
- and cryptographic auditability.

---

# Project Context

VeriMatChain AI was conceived, designed, and developed by Carlos José Castro Galante as part of the Dev3Pack Hackathon and Startup 101 Accelerator 2026.

The project represents an exploration of how modern AI systems and decentralized infrastructure can be combined to improve trust, accountability, and transparency in digital information systems.

---

# Author

## Carlos José Castro Galante

Full Stack Developer & AI Engineer  
San Juan, Argentina

- Website: https://carlosjcastrog.com
- GitHub: https://github.com/carlosjcastrog
- LinkedIn: https://linkedin.com/in/carlosjcastrog

---

# Copyright

Copyright © 2026 Carlos José Castro Galante.  
All rights reserved.

The VeriMatChain AI name, architecture, source code, verification pipeline, documentation, and associated intellectual property are protected under applicable copyright and intellectual property laws.

Unauthorized commercial reproduction, redistribution, or derivative commercial usage without prior written authorization is prohibited.

---

<p align="center">
  <strong>VeriMatChain AI</strong><br/>
  Building Verifiable Trust for the AI Era
</p>
