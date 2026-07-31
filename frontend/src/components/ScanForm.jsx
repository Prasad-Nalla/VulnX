import { useState } from "react";
import API from "../services/api";
import {
  FiClock,
  FiX,
  FiPieChart,
  FiAlertTriangle,
  FiShield,
  FiGlobe,
  FiFolder,
  FiMapPin,
  FiSearch,
  FiLock,
  FiDatabase,
  FiCpu,
  FiAlertCircle,
  FiCheckSquare,
  FiPlay,
  FiTerminal
} from "react-icons/fi";

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
import VulnScanCard from "./VulnScanCard";
import HistoryModal from "./HistoryModal";

const ScanForm = ({ initialUrl = "", onScanTriggered }) => {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [fullData, setFullData] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

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

  const sqliCount = fullData?.vuln_scan?.sqli?.count || 0;
  const xssCount = fullData?.vuln_scan?.xss?.count || 0;
  const totalActiveVulns = sqliCount + xssCount;

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 pb-20 font-['Outfit']">
      
      {/* Target Search Command Bar */}
      <div className="glass-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-mono">
            <FiTerminal className="text-emerald-400 text-base" />
            <span className="text-emerald-400 font-bold tracking-wide">root@vulnx:~#</span>
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">./scan_target.sh --full-audit</span>
          </div>

          <button
            onClick={() => setHistoryOpen(true)}
            className="px-3 py-1.5 bg-slate-900/90 hover:bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiClock className="text-emerald-400 text-xs" /> History Log
          </button>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row mt-4">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 text-emerald-500/80 pointer-events-none">
              <FiSearch className="text-lg" />
            </div>
            <input
              type="text"
              placeholder="Enter target domain or URL (e.g. example.com, target.org)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="w-full bg-slate-950/90 border border-emerald-500/40 focus:border-emerald-400 rounded-xl pl-11 pr-10 py-3.5 text-emerald-300 placeholder-slate-600 text-sm font-mono outline-none transition-all glass-input"
            />
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="absolute right-3 text-emerald-600 hover:text-emerald-300 transition-colors p-1"
                title="Clear input"
              >
                <FiX className="text-base" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleScan()}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer whitespace-nowrap font-mono"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-lg">⏳</span> AUDITING TARGET...
              </span>
            ) : (
              <>
                <FiPlay className="fill-current text-sm" /> EXECUTE AUDIT
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-mono">
            <FiAlertTriangle className="text-rose-400 text-base flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {loading && <Loader />}

      {fullData && !loading && (
        <div className="mt-8">
          
          {/* Sleek Matrix Tabbed Dashboard Bar */}
          <div className="flex overflow-x-auto gap-2 p-2 bg-slate-950/90 rounded-xl border border-emerald-500/30 mb-6 custom-tab-scrollbar shadow-inner font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "overview" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiPieChart className="text-sm" /> Executive Overview
            </button>

            <button
              onClick={() => setActiveTab("vulns")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "vulns" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiAlertTriangle className="text-sm" /> Vulnerabilities
              {totalActiveVulns > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
                  {totalActiveVulns}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  0
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("headers")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "headers" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiShield className="text-sm" /> Headers Audit
            </button>

            <button
              onClick={() => setActiveTab("cors")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "cors" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiGlobe className="text-sm" /> CORS & Security
            </button>

            <button
              onClick={() => setActiveTab("paths")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "paths" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiFolder className="text-sm" /> Sensitive Paths
            </button>

            <button
              onClick={() => setActiveTab("geo")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "geo" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiMapPin className="text-sm" /> Geo & Tech Stack
            </button>

            <button
              onClick={() => setActiveTab("osint")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "osint" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiSearch className="text-sm" /> OSINT Recon
            </button>

            <button
              onClick={() => setActiveTab("ssl")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "ssl" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiLock className="text-sm" /> SSL / TLS
            </button>

            <button
              onClick={() => setActiveTab("dns")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "dns" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiDatabase className="text-sm" /> DNS & Email
            </button>

            <button
              onClick={() => setActiveTab("ports")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "ports" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiCpu className="text-sm" /> Port Scanner
            </button>

            <button
              onClick={() => setActiveTab("phishing")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "phishing" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiAlertCircle className="text-sm" /> Threat & WHOIS
            </button>

            <button
              onClick={() => setActiveTab("remediation")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === "remediation" ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30" : "text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/50"
              }`}
            >
              <FiCheckSquare className="text-sm" /> Hardening Fixes
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

          {activeTab === "vulns" && (
            <VulnScanCard vulnData={fullData.vuln_scan} />
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

      {/* History Modal */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectTarget={(targetDomain) => handleScan(targetDomain)}
      />

    </div>
  );
};

export default ScanForm;