import os
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

# Import agents
from agents.scout import create_scout_agent
from agents.curator import create_curator_agent
from agents.editor import create_editor_agent
from agents.visual import create_visual_agent

load_dotenv()

app = FastAPI()

class FlowRequest(BaseModel):
    topics: List[str]
    context: Optional[str] = None

@app.post("/run-flow")
async def run_flow(request: FlowRequest):
    results = []
    
    # Initialize agents
    scout = create_scout_agent()
    curator = create_curator_agent()
    editor = create_editor_agent()
    visual = create_visual_agent()

    for topic in request.topics:
        try:
            # Step 1: Scout
            print(f"--- Scouting topic: {topic} ---")
            scout_response = scout.run(f"Research this topic: {topic}")
            insights = scout_response.text
            
            # Step 2: Curator
            print(f"--- Curating insights ---")
            curator_response = curator.run(f"Context: {request.context or 'General'}\nInsights: {insights}")
            ideas_json = curator_response.text
            
            # Step 3 & 4: Editor & Visual (Iterate over ideas)
            # Note: In a real implementation, we would parse the JSON here.
            # For this MVP, we'll pass the raw text to the Editor to "pick one" or process all.
            # Let's assume Curator returns a list and we process the first one for simplicity,
            # or we ask Editor to process the "best" one.
            
            print(f"--- Editing content ---")
            editor_response = editor.run(f"Draft content for these ideas: {ideas_json}")
            draft = editor_response.text
            
            print(f"--- Generating visuals ---")
            visual_response = visual.run(f"Generate visual prompts for this draft: {draft}")
            visuals_json = visual_response.text
            import json
            try:
                ideas = json.loads(ideas_json)
            except Exception:
                ideas = [{
                    "postType": "ig_carousel",
                    "mainMessage": "Consejos clave para el primer empleo",
                    "objective": "Educar",
                    "targetAudience": "youth"
                }]
            try:
                structure_obj = json.loads(draft)
            except Exception:
                structure_obj = {"slides": []}
            
            visual_prompts = []
            ascii_art = ""
            try:
                visual_data = json.loads(visuals_json)
                if isinstance(visual_data, list):
                    visual_prompts = visual_data
                elif isinstance(visual_data, dict):
                    visual_prompts = visual_data.get("prompts", [])
                    ascii_art = visual_data.get("asciiArt", "")
            except Exception:
                visual_prompts = []

            source_insights = []
            if isinstance(insights, str) and insights:
                import re
                lines = [l.strip() for l in insights.split("\n") if l.strip()]
                for l in lines:
                    m = re.search(r"\((https?://[^)]+)\)", l)
                    title = l.lstrip("- ")
                    if ":" in title:
                        title = title.split(":", 1)[0]
                    url = m.group(1) if m else ""
                    source_insights.append({
                        "sourceUrl": url,
                        "sourceTitle": title[:120],
                        "summary": l[:240]
                    })
            idea = ideas[0] if isinstance(ideas, list) and ideas else {
                "postType": "ig_carousel",
                "mainMessage": "",
                "objective": "Generated via ADK",
                "targetAudience": "youth"
            }
            results.append({
                "topic": topic,
                "postType": idea.get("postType", "ig_carousel"),
                "mainMessage": idea.get("mainMessage", ""),
                "objective": idea.get("objective", "Generated via ADK"),
                "sourceInsights": source_insights,
                "structure": structure_obj,
                "visualPrompts": visual_prompts,
                "visualMock": ascii_art
            })
            
        except Exception as e:
            print(f"Error processing topic {topic}: {e}")
            results.append({
                "topic": topic,
                "error": str(e)
            })

    return {"status": "success", "results": results}

@app.post("/run-daily")
async def run_daily():
    results = []
    
    # Initialize agents
    scout = create_scout_agent()
    curator = create_curator_agent()
    editor = create_editor_agent()
    visual = create_visual_agent()

    try:
        # Step 1: Scout for daily news
        print(f"--- Scouting daily news ---")
        import datetime
        today = datetime.date.today().strftime("%Y-%m-%d")
        scout_response = scout.run(f"Find top 5 trending news today ({today}) related to AI, Tech, and Future of Work. Focus on substantial stories.")
        insights = scout_response.text
        
        # Step 2: Curator - Pick exactly 3 and structure them
        print(f"--- Curating top 3 stories ---")
        curator_response = curator.run(f"Context: Daily News Mix {today}\nInsights: {insights}\nRequirement: Select exactly 3 distinct stories. Create one post idea for each.")
        ideas_json = curator_response.text
        
        import json
        try:
            ideas = json.loads(ideas_json)
            if not isinstance(ideas, list):
                ideas = [ideas]
        except Exception:
            ideas = []
            
        # Ensure we process up to 3 ideas
        for i, idea in enumerate(ideas[:3]):
            try:
                print(f"--- Processing Idea {i+1}/3: {idea.get('mainMessage', 'Untitled')} ---")
                
                # Step 3: Editor
                editor_response = editor.run(f"Draft content for this idea: {json.dumps(idea)}")
                draft = editor_response.text
                
                # Step 4: Visual
                visual_response = visual.run(f"Generate visual prompts for this draft: {draft}")
                visuals_json = visual_response.text
                
                # Step 5: Schedule (Simple logic: Today + 2h, +5h, +8h)
                now = datetime.datetime.now()
                planned_date = (now + datetime.timedelta(hours=2 + (i*3))).isoformat()

                # Parse results
                try:
                    structure_obj = json.loads(draft)
                except:
                    structure_obj = {"slides": []}
                
                visual_prompts = []
                ascii_art = ""
                try:
                    visual_data = json.loads(visuals_json)
                    if isinstance(visual_data, dict):
                        visual_prompts = visual_data.get("prompts", [])
                        ascii_art = visual_data.get("asciiArt", "")
                    elif isinstance(visual_data, list):
                        visual_prompts = visual_data
                except:
                    pass

                results.append({
                    "topic": idea.get("mainMessage", "Daily News"),
                    "postType": idea.get("postType", "ig_post"),
                    "mainMessage": idea.get("mainMessage", ""),
                    "objective": idea.get("objective", "News Update"),
                    "targetAudience": idea.get("targetAudience", "General"),
                    "structure": structure_obj,
                    "visualPrompts": visual_prompts,
                    "visualMock": ascii_art,
                    "plannedDate": planned_date,
                    "status": "drafting"
                })
            except Exception as e:
                print(f"Error processing idea {i}: {e}")

    except Exception as e:
        return {"status": "error", "message": str(e)}

    return {"status": "success", "results": results}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
