import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

class search_product:
    def __init__(self):
        self.results = []
    
    def search_products_google_cse(self, query, num_results=1):
        """
        Search using Google Custom Search Engine API
        """
        url = "https://www.googleapis.com/customsearch/v1"
        
        params = {
            'key': os.getenv("SEARCH_API_KEY"),
            'cx': "068bf089d39b74b14",
            'q': query,
            'num': min(num_results, 10),
            'safe': 'active'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = []  # Fresh results for this search
            
            if 'items' in data:
                for item in data['items']:
                    result = {
                        'title': item.get('title', ''),
                        'link': item.get('link', ''),
                        'url': item.get('link', ''),  # Add 'url' field for frontend compatibility
                        'snippet': item.get('snippet', ''),
                        'displayLink': item.get('displayLink', '')
                    }
                    results.append(result)
            
            # Update instance results and return current results
            self.results = results
            return results
        
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            return []