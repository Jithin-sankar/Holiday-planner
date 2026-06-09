from django.conf import settings
from google import genai

from langgraph.graph import StateGraph, END
from typing import TypedDict
from datetime import datetime

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


TRAVEL_DATA = [

    "Kochi: Fort Kochi is famous for Chinese Fishing Nets.",
    "Kochi: Marine Drive is good for evening walks.",
    "Dubai: Burj Khalifa is tallest building in the world.",
    "Dubai: Desert Safari includes dune bashing and BBQ.",
    "Paris: Eiffel Tower is iconic attraction.",
    "London: Big Ben is famous landmark.",
    "Tokyo: Shibuya Crossing is nightlife hub.",
]


AI_CACHE = {}


class TravelState(TypedDict):

    destination: str
    context: str
    prompt: str
    result: str
    days: int


def retrieve_node(state: TravelState):

    destination = state["destination"].lower()

    matches = []

    for item in TRAVEL_DATA:

        if destination in item.lower():

            matches.append(item)

   
    if not matches:

        matches = TRAVEL_DATA[:3]

    return {

        "context": "\n".join(matches)
    }



def prompt_node(state: TravelState):

    days = state.get("days", 1)

    prompt = f"""
You are a luxury AI Holiday planner.

Create a detailed {days}-day Holiday itinerary.

STRICT RULES:
- Generate EXACTLY {days} days
- Use beautiful Markdown formatting
- Add travel emojis
- Make itinerary realistic
- Include famous attractions
- Include local food
- Include hidden gems
- Include practical tips

FORMAT:

# Destination Name Holiday Guide

## Day 1

### 🌅 Morning
- activities

### ☀️ Afternoon
- activities

### 🌙 Evening
- activities

### 🍽 Food Recommendation
- food

### 💡 Travel Tips
- tips

Repeat for ALL {days} days.

--------------------------------
CONTEXT
--------------------------------
{state.get('context', '')}

--------------------------------
DESTINATION
--------------------------------
{state['destination']}
"""

    return {

        "prompt": prompt
    }



def gemini_node(state: TravelState):

    try:

        response = client.models.generate_content(

            model="gemini-1.5-flash",

            contents=state["prompt"]
        )

        return {

            "result": response.text or "No response"
        }

    except Exception as e:

        print("GEMINI ERROR:", e)

        return {

            "result": f"""
# {state['destination']} Travel Guide

## Day 1

### 🌅 Morning
- Explore the city

### ☀️ Afternoon
- Visit tourist attractions

### 🌙 Evening
- Enjoy local nightlife

### 🍽 Food Recommendation
- Try local cuisine

### 💡 Travel Tips
- Stay hydrated and travel safely
"""
        }



graph = StateGraph(TravelState)

graph.add_node(
    "retrieve",
    retrieve_node
)

graph.add_node(
    "prompt",
    prompt_node
)

graph.add_node(
    "gemini",
    gemini_node
)

graph.set_entry_point("retrieve")

graph.add_edge(
    "retrieve",
    "prompt"
)

graph.add_edge(
    "prompt",
    "gemini"
)

graph.add_edge(
    "gemini",
    END
)

app = graph.compile()



def calculate_days(start_date, end_date):

    start = datetime.strptime(
        str(start_date),
        "%Y-%m-%d"
    )

    end = datetime.strptime(
        str(end_date),
        "%Y-%m-%d"
    )

    return max(
        1,
        (end - start).days + 1
)



def generate_ai_itinerary(trip):

    key = f"""
    {trip.destination}_
    {trip.start_date}_
    {trip.end_date}
    """

    
    if key in AI_CACHE:

        return AI_CACHE[key]

    
    days = calculate_days(

        trip.start_date,
        trip.end_date
    )

   
    result = app.invoke({

        "destination": trip.destination,

        "context": "",

        "prompt": "",

        "result": "",

        "days": days
    })

   
    AI_CACHE[key] = result["result"]

    return result["result"]



def generate_preview_itinerary(data):

    destination = data.get("destination")

    start_date = data.get("start_date")

    end_date = data.get("end_date")

    travelers = data.get("travelers")

    budget = data.get("budget")

    
    days = calculate_days(
        start_date,
        end_date
    )

    
    result = app.invoke({

        "destination": destination,

        "context": "",

        "prompt": "",

        "result": "",

        "days": days
    })

    return result["result"]