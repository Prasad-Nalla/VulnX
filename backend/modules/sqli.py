import requests
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

SQLI_PAYLOADS = [
    {"payload": "'", "label": "Single Quote Injection"},
    {"payload": '"', "label": "Double Quote Injection"},
    {"payload": "' OR '1'='1", "label": "Boolean Always True Probe"},
    {"payload": "1' AND '1'='2", "label": "Boolean False Probe"},
    {"payload": "1' ORDER BY 1--", "label": "ORDER BY Column Probe"},
    {"payload": "' UNION SELECT NULL--", "label": "UNION SELECT Probe"},
]

DBMS_ERRORS = {
    "MySQL": [
        "you have an error in your sql syntax",
        "warning: mysql_",
        "valid mysql result",
        "check the manual that corresponds to your mysql server version",
        "MySqlClient."
    ],
    "PostgreSQL": [
        "pg_query(): query failed",
        "pg_exec()",
        "psycopg2.OperationalError",
        "unterminated quoted string at or near",
        "invalid input syntax for type"
    ],
    "SQLite": [
        "sqlite3.OperationalError",
        "unclosed quotation mark after the character string",
        "sqlite3.DatabaseError",
        "SQLITE_ERROR"
    ],
    "Microsoft SQL Server": [
        "driver] [sql server]",
        "OLE DB Provider for SQL Server",
        "unclosed quotation mark after the character string",
        "Microsoft OLE DB Provider for ODBC Drivers error"
    ],
    "Oracle": [
        "ORA-00933",
        "ORA-01756",
        "quoted string not properly terminated",
        "Oracle error"
    ]
}

def detect_dbms_error(response_text):
    text_lower = response_text.lower()
    for dbms, signatures in DBMS_ERRORS.items():
        for sig in signatures:
            if sig.lower() in text_lower:
                return dbms, sig
    return None, None

def scan_sqli(url, crawled_forms=None, crawled_urls=None):
    """
    Performs active SQL injection probing against GET parameters and crawled POST forms.
    """
    findings = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VulnX Security Audit Engine"
    }

    # 1. Test URL Parameters
    parsed = urlparse(url)
    if parsed.query:
        query_params = parse_qs(parsed.query)
        for param in query_params:
            for item in SQLI_PAYLOADS:
                payload = item["payload"]
                modified_params = query_params.copy()
                modified_params[param] = [payload]
                new_query = urlencode(modified_params, doseq=True)
                test_url = urlunparse((
                    parsed.scheme, parsed.netloc, parsed.path,
                    parsed.params, new_query, parsed.fragment
                ))

                try:
                    res = requests.get(test_url, headers=headers, timeout=3)
                    dbms, sig = detect_dbms_error(res.text)
                    if dbms or res.status_code == 500:
                        findings.append({
                            "type": "SQL Injection (GET Query Parameter)",
                            "target_url": url,
                            "parameter": param,
                            "payload": payload,
                            "severity": "CRITICAL" if dbms else "HIGH",
                            "dbms": dbms or "Generic SQL Syntax / 500 Error",
                            "evidence": sig or f"Server responded with HTTP {res.status_code} error to SQL probe.",
                            "remediation": "Use parameterized queries (Prepared Statements) or ORM to neutralize raw SQL payload execution."
                        })
                        break
                except Exception:
                    pass

    # 2. Test Crawled Forms
    if crawled_forms:
        for form in crawled_forms[:5]:
            form_url = form.get("form_url") or url
            method = form.get("method", "GET")
            inputs = form.get("inputs", [])

            for inp in inputs:
                input_name = inp.get("name")
                if not input_name:
                    continue

                for item in SQLI_PAYLOADS:
                    payload = item["payload"]
                    data = {}
                    for field in inputs:
                        fname = field.get("name")
                        if fname:
                            data[fname] = payload if fname == input_name else "test"

                    try:
                        if method == "POST":
                            res = requests.post(form_url, data=data, headers=headers, timeout=3)
                        else:
                            res = requests.get(form_url, params=data, headers=headers, timeout=3)

                        dbms, sig = detect_dbms_error(res.text)
                        if dbms or res.status_code == 500:
                            findings.append({
                                "type": f"SQL Injection (Form {method} Field)",
                                "target_url": form_url,
                                "parameter": input_name,
                                "payload": payload,
                                "severity": "CRITICAL" if dbms else "HIGH",
                                "dbms": dbms or "Generic SQL Syntax / 500 Error",
                                "evidence": sig or f"Form POST payload triggered HTTP {res.status_code} server error.",
                                "remediation": "Ensure form inputs are strictly sanitized and bound via prepared parameters before SQL query execution."
                            })
                            break
                    except Exception:
                        pass

    return {
        "vulnerable": len(findings) > 0,
        "count": len(findings),
        "findings": findings
    }
