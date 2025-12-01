from google.genai.agents import Agent

CURATOR_INSTRUCTIONS = """
You are the CuratorAgent.
Your input is a set of insights provided by the ScoutAgent.
Your goal is to select the most relevant insights for Laurio's audience (youth 14-22, teachers).
Propose 1 or more post ideas.
For each idea, specify:
- Post Type (ig_carousel, ig_post, story_snippet)
- Main Message
- Objective
- Target Audience
Output MUST be a JSON list of ideas.
"""

def create_curator_agent(model: str = "gemini-1.5-flash") -> Agent:
    return Agent(
        model=model,
        instructions=CURATOR_INSTRUCTIONS,
        name="CuratorAgent",
        description="Selects insights and proposes post ideas."
    )
