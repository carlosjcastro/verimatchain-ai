import json
from typing import Any
import anthropic
from config import get_settings


class ClaudeService:
    """
    Encapsulates all interactions with the Anthropic Claude API.
    Follows SRP: responsible only for LLM calls and prompt construction.
    """

    SYSTEM_PROMPT = """You are VeriMatChain AI, an expert forensic analyst specializing in 
    information integrity, cognitive bias detection, and disinformation pattern recognition.
    
    Your role is to analyze content with scientific rigor and journalistic standards. 
    You must:
    1. Identify cognitive biases (confirmation bias, framing effect, appeal to emotion, etc.)
    2. Detect missing or vague sources
    3. Recognize known disinformation patterns (false dichotomy, cherry-picking, etc.)
    4. Produce a risk score from 0.0 (fully trustworthy) to 1.0 (confirmed disinformation)
    5. Provide an explainable summary of your reasoning
    
    You ALWAYS respond in valid JSON. Never include markdown code fences in your response.
    Never include commentary outside the JSON structure."""

    def __init__(self):
        settings = get_settings()
        self._client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self._model = "claude-sonnet-4-20250514"

    def _build_analysis_prompt(self, content: str, fact_check_results: str = "") -> str:
        base = f"""Analyze the following content for information integrity:

<content>
{content}
</content>
"""
        if fact_check_results:
            base += f"""
<fact_check_evidence>
{fact_check_results}
</fact_check_evidence>
"""
        base += """
Respond with a JSON object matching this exact schema:
{{
  "risk_score": <float 0.0-1.0>,
  "risk_level": <"low"|"medium"|"high"|"critical">,
  "summary": <string: 2-3 sentence executive summary>,
  "bias_indicators": [
    {{
      "type": <string: bias name>,
      "description": <string: explanation>,
      "severity": <float 0.0-1.0>,
      "excerpt": <string: relevant quote from content, optional>
    }}
  ],
  "missing_sources": [<string: description of missing evidence>],
  "explainability": <string: detailed paragraph explaining the risk score reasoning>
}}
"""
        return base

    async def analyze_content(
        self, content: str, fact_check_results: str = ""
    ) -> dict[str, Any]:
        prompt = self._build_analysis_prompt(content, fact_check_results)

        message = self._client.messages.create(
            model=self._model,
            max_tokens=2048,
            system=self.SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )

        raw_text = message.content[0].text.strip()
        return json.loads(raw_text)