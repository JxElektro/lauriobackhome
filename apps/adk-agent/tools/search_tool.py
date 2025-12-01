import os
import requests

def search_tool(query: str) -> str:
    """
    Searches the web for the given query.
    Uses Tavily API if TAVILY_API_KEY is present, otherwise returns a mock response.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    
    if not api_key:
        print(f"[Mock Search] Query: {query}")
        return f"Mock search results for '{query}':\n1. AI is transforming entry-level jobs.\n2. Soft skills are crucial for 2025.\n3. Remote work is here to stay."

    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={"query": query, "search_depth": "basic", "max_results": 3},
            headers={"Authorization": f"Bearer {api_key}"}
        )
        response.raise_for_status()
        data = response.json()
        results = [f"- {r['title']}: {r['content']} ({r['url']})" for r in data.get("results", [])]
        return "\n".join(results)
    except Exception as e:
        return f"Error performing search: {str(e)}"
