from google.genai.agents import Agent
from tools.search_tool import search_tool

SCOUT_INSTRUCTIONS = """
You are the ScoutAgent for Laurio, an EdTech startup.
Your goal is to research topics related to the future of work, AI, and youth employability.
Given a topic, use the search_tool to find relevant, up-to-date information.
Return a summary of insights and a list of sources.
"""

def create_scout_agent(model: str = "gemini-1.5-flash") -> Agent:
    return Agent(
        model=model,
        tools=[search_tool],
        instructions=SCOUT_INSTRUCTIONS,
        name="ScoutAgent",
        description="Researches topics and provides insights."
    )
