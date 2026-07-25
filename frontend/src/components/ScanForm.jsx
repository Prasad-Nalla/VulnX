import { useState } from "react";
import API from "../services/api";

import Loader from "./Loader";
import OverviewCard from "./OverviewCard";
import ResultCard from "./ResultCard";
import TerminalPanel from "./TerminalPanel";
import SslCard from "./SslCard";
import DnsCard from "./DnsCard";
import PortScanCard from "./PortScanCard";
import PhishingCard from "./PhishingCard";
import WhoisCard from "./WhoisCard";
import RemediationCard from "./RemediationCard";
import GeoTechCard from "./GeoTechCard";
import OsintCard from "./OsintCard";
import SensitivePathsCard from "./SensitivePathsCard";
import CorsCard from "./CorsCard";

const ScanForm = ({ initialUrl = "", onScanTriggered }) => {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [fullData, setFullData] = useState(null);

  const handleScan = async (overrideUrl) => {
    const targetUrl = (typeof overrideUrl === "string" ? overrideUrl : url).trim();
    if (!targetUrl) {
      setError("Please enter a target URL or domain name.");
      return;
    }

    setUrl(targetUrl);
    setLoading(true);
    setError("");
    setFullData(null);
    setActiveTab("overview");

    const formattedUrl =
      targetUrl.startsWith("http://") || targetUrl.startsWith("https://")
        ? targetUrl
        : `https://${targetUrl}`;

    try {
      const res = await API.post("/scan/full", { url: formattedUrl });
      if (res.data && res.data.success) {
        setFullData(res.data);
      } else {
        throw new Error(res.data?.error || "Security analysis failed.");
      }
    } catch (err) {
      console.warn("Unified endpoint fallback to modular endpoints...", err);
      try {
        const [headersRes, sslRes, dnsRes, phishingRes, portsRes, domainRes, summaryRes] = await Promise.allSettled([
          API.post("/scan/headers", { url: formattedUrl }),
          API.post("/scan/ssl", { url: formattedUrl }),
          API.post("/scan/dns", { url: formattedUrl }),
          API.post("/scan/phishing", { url: formattedUrl }),
          API.post("/scan/ports", { url: formattedUrl }),
          API.post("/scan/domain", { url: formattedUrl }),
          API.post("/scan/summary", { url: formattedUrl }),
        ]);

        const headers = headersRes.status === "fulfilled" ? headersRes.value.data.headers : {};
        const raw_headers = headersRes.status === "fulfilled" ? headersRes.value.data.raw_headers : {};
        const ssl = sslRes.status === "fulfilled" ? sslRes.value.data.ssl : null;
        const dns = dnsRes.status === "fulfilled" ? dnsRes.value.data.dns : null;
        const phishing = phishingRes.status === "fulfilled" ? phishingRes.value.data.result : {};
        const ports = portsRes.status === "fulfilled" ? portsRes.value.data.ports : [];
        const domain_info = domainRes.status === "fulfilled" ? domainRes.value.data.info : null;
        const summary = summaryRes.status === "fulfilled" ? summaryRes.value.data.summary : "";

        const missingCount = Object.values(headers).filter(v => v === "Missing").length;
        const score = Math.max(0, 100 - (missingCount * 8) - (ssl?.is_valid ? 0 : 20));
        const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "F";

        setFullData({
          url: formattedUrl,
          overall: { score, grade, status: score >= 70 ? "PASS" : "RISK" },
          summary,
          headers,
          raw_headers,
          ssl,
          dns,
          phishing,
          ports,
          domain_info,
          remediations: []
        });
      } catch (fallbackErr) {
        setError(err?.response?.data?.error || err?.message || "Failed to complete website scan.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!fullData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vulnx-audit-${url.replace(/[^a-z0-9]/gi, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-20 font-mono">
      
      {/* Scanner Input Panel */}
      <div className="bg-black/95 border border-emerald-500/50 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,102,0.15)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-emerald-400 font-bold">root@kali:~/vulnx#</span>
          <span className="text-emerald-300 font-bold">./scan_target.sh</span>
        </div>
        <p className="text-emerald-600 text-xs mb-6">
          [OSINT Audit Engine: Headers | SSL | CORS | DNSSEC | Subdomains | Cookies | Metadata | Geo | Tech Stack | Ports]
        </p>

        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter domain or URL (e.g. google.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="w-full bg-black border border-emerald-500/50 focus:border-emerald-400 rounded px-4 py-3 text-emerald-300 outline-none font-mono text-xs transition-all kali-input"
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded transition-all duration-300 shadow-[0_0_15px_rgba(0,255,102,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
          >
            {loading ? "[+] AUDITING TARGET..." : "[+] EXECUTE SCAN"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-950/60 border border-red-500/50 text-red-400 text-xs flex items-center gap-2">
            <span>[-] ERROR:</span> {error}
          </div>
        )}
      </div>

      {loading && <Loader />}

      {fullData && !loading && (
        <div className="mt-8">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-black/90 rounded border border-emerald-500/40 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "overview" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [1] EXECUTIVE RATING
            </button>

            <button
              onClick={() => setActiveTab("headers")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "headers" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [2] HEADERS AUDIT
            </button>

            <button
              onClick={() => setActiveTab("cors")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "cors" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [3] CORS & DNSSEC
            </button>

            <button
              onClick={() => setActiveTab("paths")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "paths" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [4] SENSITIVE PATHS
            </button>

            <button
              onClick={() => setActiveTab("geo")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "geo" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [5] GEO & TECH STACK
            </button>

            <button
              onClick={() => setActiveTab("osint")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "osint" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [6] OSINT & SUBDOMAINS
            </button>

            <button
              onClick={() => setActiveTab("ssl")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "ssl" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [7] SSL / TLS CIPHERS
            </button>

            <button
              onClick={() => setActiveTab("dns")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "dns" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [8] DNS & EMAIL
            </button>

            <button
              onClick={() => setActiveTab("ports")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "ports" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [9] PORT SCANNER
            </button>

            <button
              onClick={() => setActiveTab("phishing")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "phishing" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [10] THREAT & WHOIS
            </button>

            <button
              onClick={() => setActiveTab("remediation")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                activeTab === "remediation" ? "bg-emerald-500 text-black shadow-[0_0_10px_#00ff66]" : "text-emerald-500 hover:text-emerald-300"
              }`}
            >
              [11] HARDENING FIXES
            </button>
          </div>

          {/* Active Tab Views */}
          {activeTab === "overview" && (
            <OverviewCard
              overall={fullData.overall}
              summary={fullData.summary}
              url={fullData.url}
              fullData={fullData}
              onExportJson={handleExportJson}
              onExportReport={handleExportReport}
            />
          )}

          {activeTab === "headers" && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {fullData.headers &&
                  Object.entries(fullData.headers).map(([key, value]) => (
                    <ResultCard key={key} title={key} status={value} />
                  ))}
              </div>
              <TerminalPanel
                results={fullData.headers}
                url={fullData.url}
                rawHeaders={fullData.raw_headers}
              />
            </div>
          )}

          {activeTab === "cors" && (
            <CorsCard
              corsAudit={fullData.cors_audit}
              dnssecInfo={fullData.dnssec_info}
            />
          )}

          {activeTab === "paths" && (
            <SensitivePathsCard
              exposedPaths={fullData.exposed_paths}
              cveAdvisories={fullData.cve_advisories}
            />
          )}

          {activeTab === "geo" && (
            <GeoTechCard
              geoInfo={fullData.geo_info}
              techStack={fullData.tech_stack}
              perfInfo={fullData.perf_info}
              securityFiles={fullData.security_files}
            />
          )}

          {activeTab === "osint" && (
            <OsintCard
              subdomainsInfo={fullData.osint_subdomains}
              cookieAudit={fullData.cookie_audit}
              pageMetadata={fullData.page_metadata}
            />
          )}

          {activeTab === "ssl" && <SslCard ssl={fullData.ssl} />}

          {activeTab === "dns" && <DnsCard dns={fullData.dns} />}

          {activeTab === "ports" && <PortScanCard ports={fullData.ports || []} />}

          {activeTab === "phishing" && (
            <div className="space-y-4">
              <PhishingCard result={fullData.phishing} />
              {fullData.domain_info && <WhoisCard info={fullData.domain_info} />}
            </div>
          )}

          {activeTab === "remediation" && (
            <RemediationCard remediations={fullData.remediations} />
          )}

        </div>
      )}
    </div>
  );
};

export default ScanForm;