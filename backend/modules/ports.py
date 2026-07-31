import socket
import shutil
import subprocess
import re
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor

# Top 100+ Common Security Service Ports Catalog with Risk & Category Classifications
PORT_CATALOG = {
    20: {"service": "FTP-Data", "category": "File Transfer", "risk": "MEDIUM"},
    21: {"service": "FTP", "category": "File Transfer", "risk": "HIGH"},
    22: {"service": "SSH", "category": "Remote Admin", "risk": "MEDIUM"},
    23: {"service": "Telnet", "category": "Remote Admin", "risk": "CRITICAL"},
    25: {"service": "SMTP", "category": "Mail Server", "risk": "MEDIUM"},
    53: {"service": "DNS", "category": "Domain Resolution", "risk": "LOW"},
    67: {"service": "DHCP Server", "category": "Network Infrastructure", "risk": "LOW"},
    68: {"service": "DHCP Client", "category": "Network Infrastructure", "risk": "LOW"},
    69: {"service": "TFTP", "category": "File Transfer", "risk": "HIGH"},
    80: {"service": "HTTP", "category": "Web Service", "risk": "LOW"},
    88: {"service": "Kerberos", "category": "Authentication", "risk": "HIGH"},
    110: {"service": "POP3", "category": "Mail Server", "risk": "MEDIUM"},
    111: {"service": "RPCBind", "category": "RPC Service", "risk": "HIGH"},
    119: {"service": "NNTP", "category": "News Service", "risk": "LOW"},
    123: {"service": "NTP", "category": "Time Sync", "risk": "LOW"},
    135: {"service": "MSRPC", "category": "Windows RPC", "risk": "HIGH"},
    137: {"service": "NetBIOS-NS", "category": "Windows NetBIOS", "risk": "HIGH"},
    138: {"service": "NetBIOS-DGM", "category": "Windows NetBIOS", "risk": "HIGH"},
    139: {"service": "NetBIOS-SSN", "category": "Windows NetBIOS", "risk": "HIGH"},
    143: {"service": "IMAP", "category": "Mail Server", "risk": "MEDIUM"},
    161: {"service": "SNMP", "category": "Network Monitoring", "risk": "HIGH"},
    162: {"service": "SNMP-Trap", "category": "Network Monitoring", "risk": "HIGH"},
    179: {"service": "BGP", "category": "Routing Protocol", "risk": "HIGH"},
    389: {"service": "LDAP", "category": "Directory Service", "risk": "HIGH"},
    443: {"service": "HTTPS", "category": "Encrypted Web", "risk": "LOW"},
    445: {"service": "SMB", "category": "Windows File Share", "risk": "CRITICAL"},
    465: {"service": "SMTPS", "category": "Encrypted Mail", "risk": "LOW"},
    500: {"service": "ISAKMP", "category": "VPN Security", "risk": "MEDIUM"},
    514: {"service": "Syslog", "category": "Logging System", "risk": "MEDIUM"},
    515: {"service": "LPD", "category": "Print Service", "risk": "LOW"},
    548: {"service": "AFP", "category": "Apple File Share", "risk": "MEDIUM"},
    554: {"service": "RTSP", "category": "Streaming Media", "risk": "LOW"},
    587: {"service": "SMTP-Submission", "category": "Mail Server", "risk": "LOW"},
    631: {"service": "CUPS", "category": "Print Server", "risk": "LOW"},
    636: {"service": "LDAPS", "category": "Encrypted Directory", "risk": "LOW"},
    873: {"service": "Rsync", "category": "File Synchronization", "risk": "HIGH"},
    993: {"service": "IMAPS", "category": "Encrypted Mail", "risk": "LOW"},
    995: {"service": "POP3S", "category": "Encrypted Mail", "risk": "LOW"},
    1025: {"service": "NFS-or-IIS", "category": "System Service", "risk": "MEDIUM"},
    1080: {"service": "SOCKS Proxy", "category": "Proxy Service", "risk": "HIGH"},
    1194: {"service": "OpenVPN", "category": "VPN Tunnel", "risk": "LOW"},
    1433: {"service": "MS-SQL Server", "category": "Database Engine", "risk": "CRITICAL"},
    1434: {"service": "MS-SQL Monitor", "category": "Database Engine", "risk": "HIGH"},
    1521: {"service": "Oracle DB", "category": "Database Engine", "risk": "CRITICAL"},
    1723: {"service": "PPTP", "category": "VPN Tunnel", "risk": "MEDIUM"},
    1883: {"service": "MQTT", "category": "IoT Protocol", "risk": "HIGH"},
    2049: {"service": "NFS", "category": "Network File System", "risk": "HIGH"},
    2082: {"service": "cPanel HTTP", "category": "Hosting Admin", "risk": "MEDIUM"},
    2083: {"service": "cPanel HTTPS", "category": "Hosting Admin", "risk": "LOW"},
    2086: {"service": "WHM HTTP", "category": "Hosting Admin", "risk": "HIGH"},
    2087: {"service": "WHM HTTPS", "category": "Hosting Admin", "risk": "MEDIUM"},
    2095: {"service": "Webmail HTTP", "category": "Mail Web UI", "risk": "MEDIUM"},
    2096: {"service": "Webmail HTTPS", "category": "Mail Web UI", "risk": "LOW"},
    2181: {"service": "ZooKeeper", "category": "Cluster Manager", "risk": "HIGH"},
    3000: {"service": "Node.js App", "category": "Web Application", "risk": "LOW"},
    3306: {"service": "MySQL DB", "category": "Database Engine", "risk": "CRITICAL"},
    3389: {"service": "RDP (Remote Desktop)", "category": "Remote Desktop", "risk": "CRITICAL"},
    4444: {"service": "Metasploit / Listener", "category": "Backdoor / Listener", "risk": "CRITICAL"},
    5000: {"service": "Flask / Docker Registry", "category": "Web Application", "risk": "MEDIUM"},
    5432: {"service": "PostgreSQL DB", "category": "Database Engine", "risk": "CRITICAL"},
    5900: {"service": "VNC Desktop", "category": "Remote Desktop", "risk": "CRITICAL"},
    5901: {"service": "VNC Display 1", "category": "Remote Desktop", "risk": "CRITICAL"},
    6379: {"service": "Redis In-Memory DB", "category": "NoSQL Database", "risk": "CRITICAL"},
    7001: {"service": "WebLogic Admin", "category": "Application Server", "risk": "HIGH"},
    8000: {"service": "HTTP Alternate API", "category": "Web Service", "risk": "LOW"},
    8080: {"service": "HTTP Proxy / Web", "category": "Web Service", "risk": "LOW"},
    8081: {"service": "HTTP Alternate", "category": "Web Service", "risk": "LOW"},
    8443: {"service": "HTTPS Alternate", "category": "Encrypted Web", "risk": "LOW"},
    8888: {"service": "Jupyter / HTTP App", "category": "Web Application", "risk": "MEDIUM"},
    9000: {"service": "SonarQube / PHP-FPM", "category": "Dev Tools", "risk": "MEDIUM"},
    9090: {"service": "Prometheus / Cockpit", "category": "Monitoring Admin", "risk": "MEDIUM"},
    9200: {"service": "Elasticsearch REST API", "category": "Search Index DB", "risk": "CRITICAL"},
    9300: {"service": "Elasticsearch Node", "category": "Search Index DB", "risk": "HIGH"},
    11211: {"service": "Memcached", "category": "Cache Server", "risk": "HIGH"},
    27017: {"service": "MongoDB NoSQL", "category": "NoSQL Database", "risk": "CRITICAL"},
    27018: {"service": "MongoDB Shard", "category": "NoSQL Database", "risk": "HIGH"},
    28017: {"service": "MongoDB Web Status", "category": "NoSQL Database", "risk": "HIGH"}
}

# Quick mode uses Top 25 ports
QUICK_PORTS = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1433, 1521, 2082, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017]

def grab_banner(sock, port, service_name):
    """
    Attempts banner grabbing from an open TCP socket.
    """
    try:
        sock.settimeout(1.2)
        # Send lightweight probe if service expects input
        if port in [80, 8080, 8000, 8081, 3000, 5000]:
            sock.sendall(b"HEAD / HTTP/1.1\r\nHost: target\r\nUser-Agent: VulnX-Scanner\r\n\r\n")
        elif port in [443, 8443]:
            return "TLS Encrypted Handshake (HTTPS)"

        banner_bytes = sock.recv(512)
        if banner_bytes:
            banner = banner_bytes.decode("utf-8", errors="ignore").strip()
            # Clean up newlines for display
            banner = re.sub(r"\s+", " ", banner)
            return banner[:150]
    except Exception:
        pass
    return f"{service_name} service active"

def check_single_port_advanced(host, port, info):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.7)
        result = sock.connect_ex((host, port))
        if result == 0:
            banner = grab_banner(sock, port, info["service"])
            sock.close()
            return {
                "port": port,
                "service": info["service"],
                "category": info["category"],
                "risk": info["risk"],
                "status": "OPEN",
                "banner": banner
            }
        sock.close()
    except Exception:
        pass
    return None

def run_nmap_cli(host, mode="standard"):
    """
    Runs actual 'nmap' binary if installed on the host system.
    """
    nmap_path = shutil.which("nmap")
    if not nmap_path:
        return None

    try:
        if mode == "quick":
            ports_arg = ",".join(str(p) for p in QUICK_PORTS)
        else:
            ports_arg = ",".join(str(p) for p in PORT_CATALOG.keys())

        cmd = [nmap_path, "-sV", "--version-intensity", "2", "-T4", "-p", ports_arg, host]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=12)

        if res.returncode == 0:
            output = res.stdout
            results = []
            for line in output.splitlines():
                # Parse lines like: 80/tcp open http Apache httpd 2.4.52
                match = re.match(r"^(\d+)/tcp\s+open\s+(\S+)\s*(.*)$", line.strip())
                if match:
                    port_num = int(match.group(1))
                    service_parsed = match.group(2)
                    version_parsed = match.group(3) or "Open"
                    
                    info = PORT_CATALOG.get(port_num, {
                        "service": service_parsed.upper(),
                        "category": "Network Service",
                        "risk": "MEDIUM"
                    })

                    results.append({
                        "port": port_num,
                        "service": info["service"],
                        "category": info["category"],
                        "risk": info["risk"],
                        "status": "OPEN",
                        "banner": f"{service_parsed} {version_parsed}".strip(),
                        "engine": "Nmap Native Engine"
                    })
            return results
    except Exception:
        pass
    return None

def scan_ports(url, mode="standard"):
    """
    Performs multi-threaded TCP port scanning and banner grabbing.
    Tries native Nmap binary first; falls back to VulnX multithreaded socket scanner.
    """
    parsed = urlparse(url)
    host = parsed.netloc or parsed.path
    host = host.split("/")[0].split(":")[0]

    if not host:
        return []

    # Attempt Nmap CLI execution if available
    nmap_results = run_nmap_cli(host, mode)
    if nmap_results is not None:
        return nmap_results

    # Fallback to high-speed native Python multithreaded socket scanner
    if mode == "quick":
        target_ports = {p: PORT_CATALOG[p] for p in QUICK_PORTS if p in PORT_CATALOG}
    else:
        target_ports = PORT_CATALOG

    results = []
    try:
        max_workers = 25 if len(target_ports) > 30 else 15
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [
                executor.submit(check_single_port_advanced, host, port, info)
                for port, info in target_ports.items()
            ]
            for future in futures:
                res = future.result()
                if res:
                    results.append(res)
    except Exception:
        pass

    results.sort(key=lambda x: x["port"])
    return results
