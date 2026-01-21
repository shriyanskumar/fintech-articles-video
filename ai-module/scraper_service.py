from duckduckgo_search import DDGS
import json
import logging
from googlesearch import search  # pip install googlesearch-python

# Configure logging
logging.basicConfig(level=logging.INFO)

def get_real_recommendations(topic):
    """
    Fetches real search results:
    - Articles: Uses Google Search "site:" queries to find results from trusted Indian financial sites.
                This is more robust than DuckDuckGo for specific site indexing.
    - Videos: Uses DuckDuckGo (works well for YouTube).
    """
    results = {
        "articles": [],
        "videos": []
    }
    
    # --- 1. Articles via Google Search (Trusted Site Loop) ---
    try:
        logging.info(f"Google-Scraping articles for: {topic}")
        
        # Priority list of trusted domains
        trusted_domains = [
            "cleartax.in", 
            "bankbazaar.com",
            "groww.in",
            "paisabazaar.com",
            "economictimes.indiatimes.com"
        ]

        found_links = set()

        for domain in trusted_domains:
            if len(results["articles"]) >= 5: # Target 5 articles total
                break
                
            # Query: "site:cleartax.in Apply for PAN Card"
            query = f"site:{domain} {topic}"
            logging.info(f"Google Searching: {query}")
            
            try:
                # search() returns a generator of URLs
                # Increase to 2 per site to get more variety if possible
                google_results = list(search(query, num_results=2, lang="en"))
                
                if google_results:
                    for url in google_results:
                        if len(results["articles"]) >= 5: break
                    # Google search lib only gives URL, not title.
                    # We can format a title from the domain + topic for display
                    # OR we can try to fetch the page title (slow).
                    # For speed/robustness, we'll format a nice title.
                    
                        if url not in found_links:
                            # Create a readable title like "ClearTax Guide: Apply for PAN Card"
                            site_name = domain.split('.')[0].capitalize()
                            if "economictimes" in domain: site_name = "Economic Times"
                            
                            display_title = f"{site_name} Guide: {topic}"
                            
                            if len(google_results) > 1 and url == google_results[1]:
                                display_title += " (Part 2)"

                            results["articles"].append({
                                "title": display_title,
                                "url": url
                            })
                            found_links.add(url)
            except Exception as g_err:
                logging.warning(f"Google search failed for {domain}: {g_err}")
                continue

        # Combine scraped results with fallback to ensure we hit the user's requested 5-6 links
        # Currently scraping gets 1 per domain (max 3-5). 
        # If we have few scraped results, append unique fallback links.
        scraped_titles = [a['title'] for a in results["articles"]]
        fallback_links = get_fallback_links(topic)
        
        for fb in fallback_links:
            if len(results["articles"]) >= 5: # Target 5
                break
            # Simple fuzzy check to avoid duplicates if scraper found the same one
            if not any(fb['url'] in a['url'] for a in results['articles']):
                results["articles"].append(fb)

        # If Google fails or yields 0, use Hardcoded Fail-Safe for common topics
        if not results["articles"]:
             results["articles"] = get_fallback_links(topic)

    except Exception as e:
        logging.error(f"Article Scraping Error: {e}")
        results["articles"] = get_fallback_links(topic)

    # --- 2. Videos via DDGS (Existing Working Method) ---
    try:
        with DDGS() as ddgs:
            video_query = f"{topic} tutorial India"
            video_results = list(ddgs.videos(video_query, region='in-en', max_results=6))
            
            for res in video_results:
                results["videos"].append({
                    "title": res.get('title', 'Video'),
                    "url": res.get('content', '#') 
                })
    except Exception as e:
        logging.error(f"Video Scraping Error: {e}")

    return results

def get_fallback_links(topic):
    """
    Returns a rich curated list of specific links based on the topic.
    This acts as a high-quality internal database when live scraping is blocked.
    """
    topic_lower = topic.lower()
    
    # 1. PAN Card
    if "pan" in topic_lower:
        return [
            {"title": "ClearTax: How to Apply for PAN Card", "url": "https://cleartax.in/s/pan-card"},
            {"title": "Protean (NSDL): Official PAN Portal", "url": "https://www.protean-tinpan.com/services/pan/pan-index.html"},
            {"title": "BankBazaar: PAN Card Application Guide", "url": "https://www.bankbazaar.com/pan-card.html"},
            {"title": "Paisabazaar: PAN Card Guide", "url": "https://www.paisabazaar.com/pan-card/"},
            {"title": "Forbes: How to Apply for PAN Card", "url": "https://www.forbes.com/advisor/in/personal-finance/how-to-apply-for-pan-card-online/"}
        ]
        
    # 2. Aadhaar Card
    elif "aadhaar" in topic_lower:
         return [
            {"title": "UIDAI: MyAadhaar Portal", "url": "https://myaadhaar.uidai.gov.in/"},
            {"title": "ClearTax: Link Aadhaar to PAN", "url": "https://cleartax.in/s/how-to-link-aadhaar-card-with-pan-card"},
            {"title": "BankBazaar: Aadhaar Card Guide", "url": "https://www.bankbazaar.com/aadhaar-card.html"},
            {"title": "India Post: Aadhaar Services", "url": "https://www.indiapost.gov.in/Financial/Pages/Content/Aadhaar-Updation-Centres.aspx"},
            {"title": "Paytm: Link Aadhaar Guide", "url": "https://paytm.com/blog/aadhaar-card/link-aadhaar-with-mobile-number/"}
        ]
        
    # 3. Driving License
    elif "driving" in topic_lower or "license" in topic_lower:
        return [
            {"title": "Parivahan Sewa: Apply for Learner License", "url": "https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do"},
            {"title": "BankBazaar: Driving Licence Guide", "url": "https://www.bankbazaar.com/driving-licence.html"},
            {"title": "Acko: Driving License Online", "url": "https://www.acko.com/driving-license/apply-for-driving-licence-online/"},
            {"title": "ClearTax: Traffic Rules", "url": "https://cleartax.in/s/traffic-fines-india"},
            {"title": "Tata AIG: Driving License Renewal", "url": "https://www.tataaig.com/knowledge-center/motor-insurance/how-to-renew-driving-licence-online"}
        ]

    # 4. Voter ID (NEW)
    elif "voter" in topic_lower:
        return [
            {"title": "Voters' Service Portal (ECI)", "url": "https://voters.eci.gov.in/"},
            {"title": "ClearTax: How to Apply for Voter ID", "url": "https://cleartax.in/s/how-to-apply-for-voter-id-card"},
            {"title": "BankBazaar: Voter ID Card Guide", "url": "https://www.bankbazaar.com/voter-id.html"},
            {"title": "National Voters Service Portal", "url": "https://www.nvsp.in/"},
            {"title": "Bajaj Finserv: Apply for Voter ID", "url": "https://www.bajajfinservmarkets.in/markets/pocket-insurance/articles/apply-for-voter-id-card-online.html"}
        ]

    # 5. Passport (NEW)
    elif "passport" in topic_lower:
        return [
            {"title": "Passport Seva: Official Portal", "url": "https://www.passportindia.gov.in/"},
            {"title": "ClearTax: Passport Application Guide", "url": "https://cleartax.in/s/apply-passport-online"},
            {"title": "BankBazaar: How to Apply for Passport", "url": "https://www.bankbazaar.com/passport/how-to-apply-for-passport.html"},
            {"title": "Tata AIG: Passport Renewal Process", "url": "https://www.tataaig.com/knowledge-center/travel-insurance/how-to-renew-passport-in-india"},
            {"title": "Paisabazaar: Passport Fees & Charges", "url": "https://www.paisabazaar.com/passport/fees/"}
        ]

    # 6. Bank Account
    elif "bank" in topic_lower and "account" in topic_lower:
         return [
            {"title": "RBI: Banking Ombudsman", "url": "https://rbi.org.in/Scripts/Complaints.aspx"},
            {"title": "BankBazaar: Savings Account", "url": "https://www.bankbazaar.com/savings-account.html"},
            {"title": "Paisabazaar: Zero Balance Accounts", "url": "https://www.paisabazaar.com/savings-account/zero-balance-savings-account/"},
            {"title": "HDFC Bank: Open Savings Account", "url": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"},
            {"title": "SBI: Savings Account", "url": "https://sbi.co.in/web/personal-banking/accounts/saving-account"}
        ]
        
    # 7. Income Tax
    elif "tax" in topic_lower:
        return [
            {"title": "Income Tax e-Filing Portal", "url": "https://www.incometax.gov.in/iec/foportal/"},
            {"title": "ClearTax: File ITR Online", "url": "https://cleartax.in/"},
            {"title": "Groww: ITR Filing Guide", "url": "https://groww.in/blog/how-to-file-itr-online"},
            {"title": "Economic Times: Income Tax News", "url": "https://economictimes.indiatimes.com/wealth/tax"},
            {"title": "BankBazaar: Tax Saving Investments", "url": "https://www.bankbazaar.com/tax/80c-deductions.html"}
        ]

    # 8. Credit Score & Loans
    elif "credit" in topic_lower or "loan" in topic_lower:
        return [
            {"title": "CIBIL: Get Free CIBIL Score", "url": "https://www.cibil.com/"},
            {"title": "BankBazaar: Credit Score Check", "url": "https://www.bankbazaar.com/cibil/cibil-score.html"},
            {"title": "Paisabazaar: Free Credit Score", "url": "https://www.paisabazaar.com/cibil-credit-report/"},
            {"title": "Bajaj Finserv: Personal Loans", "url": "https://www.bajajfinserv.in/personal-loan"},
            {"title": "HDFC Bank: Loan Interest Rates", "url": "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan"}
        ]

    # 9. Investments
    elif "invest" in topic_lower or "mutual" in topic_lower or "stock" in topic_lower:
        return [
            {"title": "Zerodha Varsity: Stock Market Education", "url": "https://zerodha.com/varsity/"},
            {"title": "Groww: Mutual Funds", "url": "https://groww.in/mutual-funds"},
            {"title": "ClearTax: Investment Guide", "url": "https://cleartax.in/s/investment-plans"},
            {"title": "MoneyControl: Markets", "url": "https://www.moneycontrol.com/"},
            {"title": "AMFI: Mutual Funds Sahi Hai", "url": "https://www.amfiindia.com/"}
        ]

    # 10. Budgeting
    elif "budget" in topic_lower:
        return [
            {"title": "ClearTax: Budgeting Tips", "url": "https://cleartax.in/s/budgeting-tips"},
            {"title": "BankBazaar: Savings Schemes", "url": "https://www.bankbazaar.com/saving-schemes.html"},
            {"title": "ET Money: Personal Finance", "url": "https://www.etmoney.com/learn/personal-finance/"},
            {"title": "Groww: Financial Planning", "url": "https://groww.in/blog/financial-planning-for-beginners"},
            {"title": "GoodReturns: Personal Finance", "url": "https://www.goodreturns.in/personal-finance/"}
        ]

    # 11. Category: Government Documents
    elif "government" in topic_lower or "official guides" in topic_lower:
        return [
            {"title": "UIDAI: Aadhaar Services", "url": "https://myaadhaar.uidai.gov.in/"},
            {"title": "Protean (NSDL): PAN Card Portal", "url": "https://www.protean-tinpan.com/"},
            {"title": "Passport Seva official Portal", "url": "https://www.passportindia.gov.in/"},
            {"title": "Parivahan: Driving License Port", "url": "https://sarathi.parivahan.gov.in/"},
            {"title": "Voters' Service Portal (ECI)", "url": "https://voters.eci.gov.in/"}
        ]

    # 12. Category: Banking
    elif "banking" in topic_lower or "bank account" in topic_lower:
        return [
            {"title": "RBI: Banking Ombudsman", "url": "https://rbi.org.in/Scripts/Complaints.aspx"},
            {"title": "HDFC Bank Savings Account", "url": "https://www.hdfcbank.com/personal/save/accounts/savings-accounts"},
            {"title": "SBI Savings Account Guide", "url": "https://sbi.co.in/web/personal-banking/accounts/saving-account"},
            {"title": "ICICI Bank Accounts", "url": "https://www.icicibank.com/personal-banking/accounts/savings-account"},
            {"title": "BankBazaar: Best Savings Accounts", "url": "https://www.bankbazaar.com/savings-account.html"}
        ]

    # 13. Category: Investing
    elif "invest" in topic_lower or "mutual" in topic_lower:
        return [
            {"title": "Zerodha Varsity: Stock Market 101", "url": "https://zerodha.com/varsity/"},
            {"title": "Groww: Mutual Funds Guide", "url": "https://groww.in/mutual-funds"},
            {"title": "AMFI: Mutual Funds Sahi Hai", "url": "https://www.amfiindia.com/"},
            {"title": "MoneyControl: Market News", "url": "https://www.moneycontrol.com/"},
            {"title": "ClearTax: Best Investment Plans", "url": "https://cleartax.in/s/investment-plans"}
        ]

    else:
        # Default Generic (but decent)
        return [
            {"title": "ClearTax: All Financial Guides", "url": "https://cleartax.in/"},
            {"title": "BankBazaar: Financial Products and Articles", "url": "https://www.bankbazaar.com/"},
            {"title": "Economic Times: Wealth & Personal Finance", "url": "https://economictimes.indiatimes.com/wealth"},
            {"title": "MoneyControl: Personal Finance News", "url": "https://www.moneycontrol.com/personal-finance/"},
            {"title": "Groww: Financial Education Blog", "url": "https://groww.in/blog"}
        ]

if __name__ == "__main__":
    # Test
    print(json.dumps(get_real_recommendations("Apply for PAN Card"), indent=2))
