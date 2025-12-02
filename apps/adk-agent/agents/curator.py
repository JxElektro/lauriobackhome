from types import SimpleNamespace

try:
    from google.genai.agents import Agent
except Exception:
    class Agent:
        def __init__(self, model: str = "stub", instructions: str = "", name: str = "", description: str = ""):
            pass
        def run(self, prompt: str):
            ideas = [
                {
                    "postType": "ig_carousel",
                    "mainMessage": "Consejos clave para el primer empleo",
                    "objective": "Educar",
                    "targetAudience": "youth"
                },
                {
                    "postType": "ig_carousel",
                    "mainMessage": "IA en el aula: cómo empezar sin costo",
                    "objective": "Informar",
                    "targetAudience": "teachers"
                },
                {
                    "postType": "ig_carousel",
                    "mainMessage": "Habilidades 2025: qué buscan las empresas",
                    "objective": "Orientar",
                    "targetAudience": "youth"
                }
            ]
            return SimpleNamespace(text=__import__("json").dumps(ideas))

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
