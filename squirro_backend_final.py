import argparse
import logging
import requests
import time
import math

log = logging.getLogger(__name__)

class NYTimesSource(object):
    def __init__(self, api_key, search_value):
        self.api_key = api_key
        self.search_value = search_value

    def connect(self, inc_column=None, max_inc_value=None):
        log.debug("Incremental Column: %r", inc_column)
        log.debug("Incremental Last Value: %r", max_inc_value)

    def disconnect(self):
        pass

    def getDataBatch(self, batch_size, batches):
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"

        all_articles = []
        print("given batch size", batch_size)
        print("given_batches", batches)
        pages = math.ceil((batches*batch_size)/10)
        print("downloaded_pages",pages)
        for page in range(1, int(pages)+1):  # Fetch articles up to page 10
            
            params = {
                "api-key": self.api_key,
                "q": self.search_value,
                "sort": "newest",
                "fl": "web_url,headline,_id",
                "page": page
            }

            response = requests.get(url, params=params)
            time.sleep(2)  # Add a 2-second delay between requests

            try:
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("response", {}).get("docs", [])
                    all_articles.extend(articles)
                    counter = page
                else:
                    # print("here")
                    if page == batch_size:
                        print(f"NY times only provided {counter} pages for this seach word: {self.search_value} now. So only displaying {counter} batches")
            except Exception as a:
                print(f"Error fetching articles for page {page} with error {a}")
            
    
        # Generate batches of 10 items each
        for i in range(0, batch_size*batches, batch_size):
            batch = all_articles[i:i + batch_size]
            yield batch
            

    def getSchema(self):
        schema = [
            "web_url",
            "headline.main",
            "headline.kicker",
            # ... Add more fields as needed
        ]
        return schema

if __name__ == "__main__":
    api_key = input("Enter your New York Times API key (or press Enter for default, RK's key): ")
    if not api_key:
        api_key = "ei02xAcM97O8ZLoSsgRPYyHhd2oS7P1C"  # Set default API key here

    search_value = input("Enter the search value (or press Enter for default, Silicon Valley): ")
    if not search_value:
        search_value = "Silicon Valley"  # Set  default search value here

    display_type = input("Enter json/ JSON if want to see values in the JSON/dict format (or presss enter for default, bath with id): ")
    if not display_type:
        display_type = "batch" #Set for default display type here
    
    batch_size = input("Enter batch_size (default is 2, each batch contains 2 items):")
    if batch_size:
        batch_size = int(batch_size)
    if not batch_size:
        batch_size = 2  # Default batch size

    batches = input("Number of batches needed (or press Enter for default, 10):")
    if batches:
        batches =int(batches)
    if not batches:
        batches = 10

    source = NYTimesSource(api_key, search_value)

    source.args = argparse.Namespace(api_key=api_key, search_value=search_value)

    import pprint

    pp = pprint.PrettyPrinter(indent=4)  # Create a PrettyPrinter object with an indentation of 4 spaces

    for idx, batch in enumerate(source.getDataBatch(batch_size,batches)):
        # print(idx)
        print(f"Batch {idx + 1} of {len(batch)} items:")
        if display_type == "batch":
            for item in batch:
                print(f"  - {item['_id']} - {item['headline']['main']}")
        elif display_type.lower() == "json":
            for item in batch:
                flattened_item = {}
                for key, value in item.items():
                    if isinstance(value, dict):
                        for sub_key, sub_value in value.items():
                            flattened_item[f"{key}.{sub_key}"] = sub_value
                    else:
                        flattened_item[key] = value
                pp.pprint(flattened_item)  # Pretty print the flattened item
            