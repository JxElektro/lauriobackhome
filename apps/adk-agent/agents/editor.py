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
                    {"id": 1, "role": "hook", "text": "Tu primer empleo: 3 claves\n- Empieza por lo básico: CV claro, breve\n- Define 1-2 objetivos de aprendizaje\n- Aplica a roles junior con mentoría"},
                    {"id": 2, "role": "context", "text": "Soft skills abren puertas\n- Comunicación: escucha activa + claridad\n- Responsabilidad: cumplir tiempos y acuerdos\n- Adaptabilidad: aprender y iterar rápido"},
                    {"id": 3, "role": "insight", "text": "Comunicación, responsabilidad, adaptabilidad\n- Son las 3 habilidades más valoradas\n- Importan más que la herramienta específica\n- Se demuestran en prácticas y proyectos"},
                    {"id": 4, "role": "example", "text": "Caso: prácticas exitosas\n- Alumna sin experiencia: 3 meses de prácticas\n- Diario de aprendizaje y feedback semanal\n- Resultado: primer empleo como asistente"},
                    {"id": 5, "role": "cta", "text": "Comparte y guarda\n- Comparte si te ayudó\n- Guarda para usar en tu próxima entrevista\n- Etiqueta a alguien que esté buscando empleo"}
                ],
                "caption": "Primer empleo: claves prácticas para empezar bien. Haz foco en habilidades blandas (comunicación, responsabilidad, adaptabilidad), busca roles con mentoría y registra tus avances. CTA: comparte y guarda. #PrimerEmpleo #SoftSkills #AprenderHaciendo #Laurio"
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
