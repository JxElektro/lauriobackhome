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
            ideas_json = curator_response.text # Expecting JSON string
            
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
            visuals = visual_response.text
            
            results.append({
                "topic": topic,
                "insights": insights,
                "ideas": ideas_json,
                "draft": draft,
                "visuals": visuals
            })
            
        except Exception as e:
            print(f"Error processing topic {topic}: {e}")
            results.append({
                "topic": topic,
                "error": str(e)
            })

    return {"status": "success", "results": results}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
