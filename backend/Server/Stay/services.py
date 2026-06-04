from serpapi import GoogleSearch
from django.conf import settings


def fetch_hotels(city):

    try:

        params = {
            "engine": "google_hotels",
            "q": f"hotels in {city}",
            "api_key": settings.SERP_API_KEY,
            "check_in_date": "2026-06-01",
            "check_out_date": "2026-06-05",
            "adults": 2,
            "currency": "INR",
            "gl": "in",
            "hl": "en"
        }

        search = GoogleSearch(params)

        results = search.get_dict()

        hotels = results.get("properties", [])

        print(f"Found {len(hotels)} hotels in {city}")

        return hotels

    except Exception as e:

        print("Hotel API Error:", e)

        return []