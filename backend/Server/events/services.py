from django.conf import settings
import requests

def fetch_live_events(city_name):
    clean_city = city_name.strip()
    print(f"🎟️ Searching Google Events via SerpApi for: {clean_city}...")
    
    url = "https://serpapi.com/search.json"
    querystring = {
        "engine": "google_events",
        "q": f"events in {clean_city}",
        "hl": "en",
        "gl": "in", 
        
        "api_key": settings.SERP_API_KEY 
    }

    try:
        response = requests.get(url, params=querystring, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            events = []
            
           
            if 'events_results' in data:
               
                raw_events = data['events_results'][:6] 
                
                for index, evt in enumerate(raw_events):
                  
                    address_list = evt.get('address', [])
                    location_name = address_list[0] if address_list else f"Venue in {clean_city.title()}"
                    
                   
                    date_info = evt.get('date', {})
                    
                    events.append({
                        "id": f"evt_{index}",
                        "title": evt.get('title', 'Local Event'),
                        "image": evt.get('thumbnail', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80'),
                        "date": date_info.get('start_date', 'See details'),
                        "time": date_info.get('when', 'Check timing'),
                        "category": "Local Event", 
                        "location": location_name,
                        "price": "Check Site"
                    })
            
            print(f"✅ Found {len(events)} real Indian events in {clean_city}!")
            return events
        else:
            print(f"❌ SerpApi Error: {response.status_code} - Check your API key")
            return []
            
    except Exception as e:
        print(f"🚨 Network Error: {e}")
        return []