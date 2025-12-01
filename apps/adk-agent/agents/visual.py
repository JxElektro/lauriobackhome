from google.genai.agents import Agent

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
