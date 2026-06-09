from serpapi import GoogleSearch
from django.conf import settings
from datetime import datetime, timedelta


def fetch_hotels(city):

    try:
        check_in = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        check_out = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")

        params = {
            "engine": "google_hotels",
            "q": f"hotels in {city}",
            "api_key": settings.SERP_API_KEY,
            "check_in_date": check_in,
            "check_out_date": check_out,
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