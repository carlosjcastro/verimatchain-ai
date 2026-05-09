import httpx
from bs4 import BeautifulSoup
from typing import Optional


async def extract_content_from_url(url: str) -> Optional[str]:
    """
    Fetches a URL and extracts the main textual content using BeautifulSoup.
    Returns the cleaned text or None on failure.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; VeriMatChainBot/1.0; +https://verimatchain.ai/bot)"
        )
    }
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        try:
            response = await client.get(str(url), headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError:
            return None
        except httpx.RequestError:
            return None

    soup = BeautifulSoup(response.text, "lxml")

    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
        tag.decompose()

    article = soup.find("article")
    if article:
        text = article.get_text(separator=" ", strip=True)
    else:
        body = soup.find("body")
        text = body.get_text(separator=" ", strip=True) if body else ""

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    cleaned = " ".join(lines)

    if len(cleaned) < 50:
        return None

    return cleaned[:40000]