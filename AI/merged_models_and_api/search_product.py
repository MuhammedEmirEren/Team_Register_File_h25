import requests
import json
from dotenv import load_dotenv
import os
import re
from fastapi import HTTPException

load_dotenv()

class search_product:
    def __init__(self):
        self.results = []

        self.product_patterns = [
                r'/product/',
                r'/products/',
                r'/item/',
                r'/items/',
                r'/p/',
                r'/dp/',  # Amazon
                r'/pd/',  # Some sites use pd
                r'/shop/',
                r'/buy/',
                r'/store/',
                r'product-',
                r'item-',
                r'/goods/',
                r'/merchandise/',
                r'/catalog/',
                r'/detail/',
                r'/details/',
                r'/product-detail/',
                r'productId=',
                r'itemId=',
                r'sku=',
                r'/sku/',
            ]
        
    def is_product_url(self, url):
        """Check if URL looks like a product page"""
        url_lower = url.lower()
        
        # Check for product patterns in URL
        for pattern in self.product_patterns:
            if re.search(pattern, url_lower):
                return True  
            
        return False
    
    def search_products_google_cse(self, query, num_results=5):
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
            first_result = None
            if 'items' in data:
                for i, item in enumerate(data['items']):
                    link = item.get('link', '')
                    if(i == 0):
                        first_result = {
                            'title': item.get('title', ''),
                            'link': link,
                            'url': link,
                            'snippet': item.get('snippet', ''),
                            'displayLink': item.get('displayLink', ''),
                            'is_product': True
                        }

                    # Filter for product URLs
                    if self.is_product_url(link):
                        result = {
                            'title': item.get('title', ''),
                            'link': link,
                            'url': link,
                            'snippet': item.get('snippet', ''),
                            'displayLink': item.get('displayLink', ''),
                            'is_product': True
                        }
                        results.append(result)
                        break
            
            # Update instance results and return current results
            self.results = results
            if not self.results:
                return first_result
            return results
        
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            return []