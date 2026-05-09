import httpx
from typing import List, Optional
from config import get_settings


class FactCheckService:
    """
    Queries the Google Fact Check Tools API for claims related to the content.
    Implements RAG pattern: retrieves real-world fact-check evidence to augment AI analysis.
    """

    BASE_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

    def __init__(self):
        settings = get_settings()
        self._api_key = settings.google_fact_check_api_key

    async def search_claims(self, query: str, language: str = "es") -> List[dict]:
        """
        Searches for fact-checked claims related to the query string.
        Returns a structured list of claims with ratings and sources.
        """
        truncated_query = query[:200].strip()

        params = {
            "key": self._api_key,
            "query": truncated_query,
            "languageCode": language,
            "pageSize": 5,
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()
            except (httpx.HTTPStatusError, httpx.RequestError):
                return []

        claims = []
        for item in data.get("claims", []):
            claim_text = item.get("text", "")
            for review in item.get("claimReview", []):
                claims.append(
                    {
                        "claim": claim_text,
                        "rating": review.get("textualRating", "Unknown"),
                        "source": review.get("url", ""),
                        "publisher": review.get("publisher", {}).get("name", "Unknown"),
                        "url": review.get("url", ""),
                    }
                )

        return claims[:5]

    def format_for_prompt(self, claims: List[dict]) -> str:
        """Converts fact-check results into a structured string for LLM prompt injection."""
        if not claims:
            return ""
        lines = []
        for idx, claim in enumerate(claims, 1):
            lines.append(
                f"{idx}. CLAIM: {claim['claim']}\n"
                f"   RATING: {claim['rating']}\n"
                f"   SOURCE: {claim['publisher']} ({claim['url']})"
            )
        return "\n".join(lines)