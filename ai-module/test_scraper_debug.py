from duckduckgo_search import DDGS

def test_query(query, region=None):
    print(f"Testing Query: '{query}' [Region: {region}]")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, region=region, max_results=3))
            print(f"Found {len(results)} results.")
            for r in results:
                print(f" - {r.get('title')} ({r.get('href')})")
    except Exception as e:
        print(f"ERROR: {e}")
    print("-" * 20)

if __name__ == "__main__":
    t = "Apply for PAN Card Submit"
    test_query(f"site:cleartax.in {t}", region="in-en")
    test_query(f"site:bankbazaar.com {t}", region="in-en")
    test_query(f"site:economictimes.indiatimes.com {t}", region="in-en")
