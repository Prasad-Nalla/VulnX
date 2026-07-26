import socket
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor

COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    8080: "HTTP-ALT",
    8443: "HTTPS-ALT",
    27017: "MongoDB"
}

def check_single_port(host, port, service):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            return {"port": port, "service": service, "status": "OPEN"}
    except Exception:
        pass
    return None

def scan_ports(url):
    """
    Performs multi-threaded TCP port scanning for common security ports.
    """
    parsed = urlparse(url)
    host = parsed.netloc or parsed.path
    host = host.split("/")[0].split(":")[0]

    if not host:
        return []

    results = []
    try:
        with ThreadPoolExecutor(max_workers=12) as executor:
            futures = [
                executor.submit(check_single_port, host, port, service)
                for port, service in COMMON_PORTS.items()
            ]
            for future in futures:
                res = future.result()
                if res:
                    results.append(res)
    except Exception:
        pass

    results.sort(key=lambda x: x["port"])
    return results
