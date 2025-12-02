from types import SimpleNamespace

try:
    from google.genai.agents import Agent
except Exception:
    class Agent:
        def __init__(self, model: str = "stub", instructions: str = "", name: str = "", description: str = ""):
            pass
        def run(self, prompt: str):
            prompts = [
                {"forSlide": 1, "description": "Joven en oficina moderna, título grande"},
                {"forSlide": 2, "description": "Iconos de soft skills, estilo flat"}
            ]
            return SimpleNamespace(text=__import__("json").dumps(prompts))

VISUAL_INSTRUCTIONS = """
You are the VisualAgent.
Your input is the drafted content from the EditorAgent.
Your goal is to generate image prompts for an AI image generator.
Style: Clean, modern, suitable for an EdTech startup.
For carousels, provide a prompt for each slide that needs a visual.
Output MUST be a JSON object with visual prompts.
"""

def create_visual_agent(model: str = "gemini-1.5-flash") -> Agent:
    return Agent(
        model=model,
        instructions=VISUAL_INSTRUCTIONS,
        name="VisualAgent",
        description="Generates image prompts."
    )
