import requests
import json

def search_products_google_cse(query, num_results=1):
    """
    Search using Google Custom Search Engine API
    Get API key: https://developers.google.com/custom-search/v1/introduction
    Create CSE: https://cse.google.com/cse/
    """
    url = "https://www.googleapis.com/customsearch/v1"
    
    params = {
        'key': "AIzaSyBQJacoPVr3LZaxiB6eOt4KSMa-1DfCrbA",
        'cx': "068bf089d39b74b14",
        'q': query,
        'num': min(num_results, 10),
        'safe': 'active'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        results = []
        
        if 'items' in data:
            for item in data['items']:
                results.append({
                    'title': item.get('title', ''),
                    'link': item.get('link', ''),
                    'snippet': item.get('snippet', ''),
                    'displayLink': item.get('displayLink', '')
                })
        
        return results
    
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return []

results = search_products_google_cse("Nike Air Force 1 '07 - Classic White", 3)
print(json.dumps(results, indent=2))