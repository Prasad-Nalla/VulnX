from datetime import datetime

def generate_report_html(scan_data):
    """
    Generates a standalone, beautifully formatted Kali HTML security report.
    """
    url = scan_data.get("url", "N/A")
    overall = scan_data.get("overall", {})
    score = overall.get("score", 0)
    grade = overall.get("grade", "F")
    status = overall.get("status", "RISK")
    summary = scan_data.get("summary", "")

    headers = scan_data.get("headers", {})
    ssl_data = scan_data.get("ssl", {})
    dns_data = scan_data.get("dns", {})
    ports = scan_data.get("ports", [])
    vuln_scan = scan_data.get("vuln_scan", {})
    sqli_findings = vuln_scan.get("sqli", {}).get("findings", [])
    xss_findings = vuln_scan.get("xss", {}).get("findings", [])
    remediations = scan_data.get("remediations", [])

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VulnX Audit Security Report - {url}</title>
    <style>
        body {{
            background-color: #090d16;
            color: #e2e8f0;
            font-family: 'Courier New', Courier, monospace;
            padding: 30px;
            margin: 0;
        }}
        .container {{
            max-width: 950px;
            margin: 0 auto;
            border: 1px solid #10b981;
            padding: 30px;
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
            border-radius: 8px;
        }}
        .header {{
            border-bottom: 2px solid #10b981;
            padding-bottom: 15px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        h1 {{
            color: #10b981;
            font-size: 24px;
            margin: 0;
        }}
        .sub {{
            color: #64748b;
            font-size: 12px;
            margin-top: 5px;
        }}
        .badge {{
            display: inline-block;
            padding: 6px 14px;
            background-color: #064e3b;
            color: #34d399;
            border: 1px solid #10b981;
            border-radius: 4px;
            font-weight: bold;
            font-size: 18px;
        }}
        .section {{
            margin-bottom: 25px;
        }}
        .section-title {{
            color: #10b981;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px dashed #059669;
            padding-bottom: 5px;
            margin-bottom: 12px;
            text-transform: uppercase;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }}
        th, td {{
            border: 1px solid #1e293b;
            padding: 8px 12px;
            text-align: left;
        }}
        th {{
            background-color: #0f172a;
            color: #38bdf8;
        }}
        tr:nth-child(even) {{
            background-color: #0f172a/50;
        }}
        .crit {{ color: #ef4444; font-weight: bold; }}
        .high {{ color: #f97316; font-weight: bold; }}
        .med {{ color: #eab308; font-weight: bold; }}
        .ok {{ color: #10b981; font-weight: bold; }}
        .box {{
            background-color: #022c22;
            border: 1px solid #059669;
            padding: 12px;
            border-radius: 4px;
            font-size: 12px;
            line-height: 1.5;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>VulnX EXECUTIVE SECURITY AUDIT REPORT</h1>
                <div class="sub">TARGET: {url} | GENERATED: {now_str}</div>
            </div>
            <div class="badge">
                GRADE: {grade} ({score}/100)
            </div>
        </div>

        <div class="section">
            <div class="section-title">[+] EXECUTIVE SUMMARY</div>
            <div class="box">
                <strong>Status: {status}</strong><br>
                {summary}
            </div>
        </div>

        <div class="section">
            <div class="section-title">[+] ACTIVE VULNERABILITY ASSESSMENTS (SQLi & XSS)</div>
            <table>
                <thead>
                    <tr>
                        <th>Vulnerability Type</th>
                        <th>Severity</th>
                        <th>Target Endpoint / Field</th>
                        <th>Payload / Evidence</th>
                    </tr>
                </thead>
                <tbody>
"""

    if not sqli_findings and not xss_findings:
        html_content += """
                    <tr>
                        <td colspan="4" class="ok">No SQL Injection or Reflected XSS vulnerabilities detected during active probing.</td>
                    </tr>
        """
    else:
        for item in sqli_findings:
            html_content += f"""
                    <tr>
                        <td class="crit">{item.get('type')}</td>
                        <td class="crit">{item.get('severity')}</td>
                        <td>{item.get('parameter')} ({item.get('target_url')})</td>
                        <td><code>{item.get('payload')}</code></td>
                    </tr>
            """
        for item in xss_findings:
            html_content += f"""
                    <tr>
                        <td class="high">{item.get('type')}</td>
                        <td class="high">{item.get('severity')}</td>
                        <td>{item.get('parameter')} ({item.get('target_url')})</td>
                        <td><code>{item.get('payload')}</code></td>
                    </tr>
            """

    html_content += """
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">[+] HTTP SECURITY HEADERS AUDIT</div>
            <table>
                <thead>
                    <tr>
                        <th>Security Header</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
"""
    for h, status_val in headers.items():
        css_cls = "ok" if status_val != "Missing" else "crit"
        html_content += f"""
                    <tr>
                        <td>{h}</td>
                        <td class="{css_cls}">{status_val}</td>
                    </tr>
        """

    html_content += f"""
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">[+] OPEN PORT AUDIT</div>
            <table>
                <thead>
                    <tr>
                        <th>Port Number</th>
                        <th>Service</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
"""
    if not ports:
        html_content += """
                    <tr><td colspan="3" class="ok">No common open ports detected.</td></tr>
        """
    else:
        for p in ports:
            html_content += f"""
                    <tr>
                        <td>{p.get('port')}</td>
                        <td>{p.get('service')}</td>
                        <td class="high">{p.get('status')}</td>
                    </tr>
            """

    html_content += """
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">[+] RECOMMENDED HARDENING ACTIONS</div>
            <table>
                <thead>
                    <tr>
                        <th>Finding Title</th>
                        <th>Severity</th>
                        <th>Impact / Recommended Action</th>
                    </tr>
                </thead>
                <tbody>
"""
    if not remediations:
        html_content += """
                    <tr><td colspan="3" class="ok">No urgent remediation actions required.</td></tr>
        """
    else:
        for r in remediations:
            html_content += f"""
                    <tr>
                        <td>{r.get('title')}</td>
                        <td class="high">{r.get('severity')}</td>
                        <td>{r.get('impact')}<br><code>{r.get('nginx')}</code></td>
                    </tr>
            """

    html_content += """
                </tbody>
            </table>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #475569; font-size: 10px;">
            Generated by VulnX v2.0 - Kali Linux Web Security & Intelligence Suite
        </div>
    </div>
</body>
</html>
"""
    return html_content
