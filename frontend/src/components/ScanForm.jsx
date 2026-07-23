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
      // Fast single-pass parallel API scan
      const res = await API.post("/scan/full", { url: formattedUrl });
      if (res.data && res.data.success) {
        setFullData(res.data);
      } else {
        throw new Error(res.data?.error || "Security analysis failed.");
      }
    } catch (err) {
      console.warn("Unified endpoint fallback to modular endpoints...", err);
      // Fallback to modular endpoints if backend is running legacy code
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

        // Calculate score fallback
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
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-20">
      
      {/* Scanner Input Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-3xl font-black text-white tracking-tight">
          Website Security Audit Engine
        </h2>
        <p className="text-slate-400 text-sm mt-2 mb-6">
          Comprehensive real-time analysis: Security Headers, SSL/TLS Ciphers, DNS Email Spoofing, Port Scanner, and Phishing Heuristics.
        </p>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. google.com or https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl px-5 py-4 text-white outline-none font-mono text-sm transition-all shadow-inner"
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Scanning Target..." : "Run Security Audit"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>

      {loading && <Loader />}

      {fullData && !loading && (
        <div className="mt-10">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 backdrop-blur-md mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              📊 Executive Rating
            </button>

            <button
              onClick={() => setActiveTab("headers")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "headers" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🛡️ Security Headers
            </button>

            <button
              onClick={() => setActiveTab("ssl")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ssl" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🔒 SSL / TLS Encryption
            </button>

            <button
              onClick={() => setActiveTab("dns")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dns" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🌐 DNS & Email Security
            </button>

            <button
              onClick={() => setActiveTab("ports")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ports" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🔌 Port Scanner
            </button>

            <button
              onClick={() => setActiveTab("phishing")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "phishing" ? "bg-cyan-500 text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🎣 Threat & WHOIS
            </button>

            <button
              onClick={() => setActiveTab("remediation")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "remediation" ? "bg-violet-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              🛠️ Remediation Fixes
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
            <div className="space-y-6">
              <div className="grid gap-4">
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

          {activeTab === "ssl" && <SslCard ssl={fullData.ssl} />}

          {activeTab === "dns" && <DnsCard dns={fullData.dns} />}

          {activeTab === "ports" && <PortScanCard ports={fullData.ports || []} />}

          {activeTab === "phishing" && (
            <div className="space-y-6">
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