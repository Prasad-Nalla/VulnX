import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re

def crawl_target(url, max_pages=15, timeout=4):
    """
    Crawls target URL to collect internal links, forms, input parameters, and endpoints.
    """
    parsed_start = urlparse(url)
    base_domain = parsed_start.netloc

    visited = set()
    to_visit = [url]

    crawled_pages = []
    discovered_forms = []
    discovered_endpoints = []
    discovered_params = []

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VulnX/2.0 Security Scanner"
    }

    while to_visit and len(visited) < max_pages:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        visited.add(current_url)

        try:
            res = requests.get(current_url, headers=headers, timeout=timeout, allow_redirects=True)
            if "text/html" not in res.headers.get("Content-Type", ""):
                continue

            crawled_pages.append({
                "url": current_url,
                "status_code": res.status_code,
                "size_bytes": len(res.content)
            })

            # Check URL query params
            parsed_curr = urlparse(current_url)
            if parsed_curr.query:
                params = [p.split("=")[0] for p in parsed_curr.query.split("&") if p]
                if params:
                    discovered_params.append({
                        "url": current_url,
                        "params": params,
                        "type": "URL Query"
                    })

            soup = BeautifulSoup(res.text, "html.parser")

            # Extract Forms & Inputs
            for form in soup.find_all("form"):
                action = form.get("action") or ""
                method = (form.get("method") or "GET").upper()
                form_url = urljoin(current_url, action)

                inputs = []
                for inp in form.find_all(["input", "textarea", "select"]):
                    name = inp.get("name")
                    if name:
                        inputs.append({
                            "name": name,
                            "type": inp.get("type", "text"),
                            "value": inp.get("value", "")
                        })

                if inputs:
                    discovered_forms.append({
                        "page_url": current_url,
                        "form_url": form_url,
                        "method": method,
                        "inputs": inputs
                    })

            # Extract Links
            for link in soup.find_all("a", href=True):
                href = link["href"].strip()
                if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
                    continue

                full_url = urljoin(current_url, href)
                parsed_full = urlparse(full_url)

                if parsed_full.netloc == base_domain and full_url not in visited:
                    if full_url not in discovered_endpoints:
                        discovered_endpoints.append(full_url)
                    if len(to_visit) < max_pages * 2:
                        to_visit.append(full_url)

        except Exception:
            pass

    return {
        "target": url,
        "total_crawled": len(crawled_pages),
        "crawled_pages": crawled_pages[:max_pages],
        "discovered_endpoints": discovered_endpoints[:20],
        "discovered_forms": discovered_forms[:15],
        "discovered_params": discovered_params[:15]
    }
