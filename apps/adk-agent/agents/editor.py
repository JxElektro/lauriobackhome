from types import SimpleNamespace

try:
    from google.genai.agents import Agent
except Exception:
    class Agent:
        def __init__(self, model: str = "stub", instructions: str = "", name: str = "", description: str = ""):
            pass
        def run(self, prompt: str):
            structure = {
                "slides": [
                    {"id": 1, "role": "hook", "text": "Tu primer empleo: 3 claves"},
                    {"id": 2, "role": "context", "text": "Soft skills abren puertas"},
                    {"id": 3, "role": "insight", "text": "Comunicación, responsabilidad, adaptabilidad"},
                    {"id": 4, "role": "example", "text": "Caso: prácticas exitosas"},
                    {"id": 5, "role": "cta", "text": "Comparte y guarda"}
                ]
            }
            return SimpleNamespace(text=__import__("json").dumps(structure))

EDITOR_INSTRUCTIONS = """
You are the EditorAgent.
Your input is a post idea from the CuratorAgent.
Your goal is to draft the content.
- For ig_carousel: Create 5-7 slides (hook, context, insight, example, cta).
- For ig_post: Create a headline and a caption.
- For story_snippet: Create short, punchy text.
Tone: Approachable, practical, inspiring.
Output MUST be a JSON object with the structure.
"""

def create_editor_agent(model: str = "gemini-1.5-flash") -> Agent:
    return Agent(
        model=model,
        instructions=EDITOR_INSTRUCTIONS,
        name="EditorAgent",
        description="Drafts the content for posts."
    )
