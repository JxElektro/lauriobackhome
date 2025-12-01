from google.genai.agents import Agent

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
