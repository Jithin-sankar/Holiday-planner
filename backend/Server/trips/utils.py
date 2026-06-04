
import requests

from django.conf import settings


def get_destination_image(destination):

    try:

        url = "https://api.unsplash.com/search/photos"
        
        headers = {
            "Accept-Version": "v1"
        }

        params = {

            "query": destination,
            "client_id": settings.UNSPLASH_ACCESS_KEY,
            "per_page": 1
        }

        response = requests.get(

            url,

            headers=headers,
            params=params
        )

        if response.status_code == 200:

            data = response.json()

            results = data.get("results")

            if results:

                return results[0]["urls"]["regular"]

        return ""

    except Exception as e:

       

        return ""