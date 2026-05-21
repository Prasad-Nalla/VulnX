import { useState } from "react";

import API from "../services/api";

import Loader from "./Loader";
import ResultCard from "./ResultCard";
import TerminalPanel from "./TerminalPanel";
import PhishingCard from "./PhishingCard";
import PortScanCard from "./PortScanCard";
import AISummaryCard from "./AISummaryCard";
import WhoisCard from "./WhoisCard";
const ScanForm = () => {

  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState(null);

  const [phishingResult, setPhishingResult] = useState(null);

  const [error, setError] = useState("");
  const [ports, setPorts] = useState([]);
  const [rawHeaders, setRawHeaders] = useState(null);
const [summary, setSummary] = useState("");
const[domainInfo,setDomainInfo]=useState(null);
  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);
    setPhishingResult(null);
    setRawHeaders(null);
    setPorts([]);
    setSummary("");
    setDomainInfo(null);

    const formattedUrl =
      url.trim().startsWith("http://") ||
      url.trim().startsWith("https://")
        ? url.trim()
        : `https://${url.trim()}`;

    try {
      const [
        summaryResult,
        headersResult,
        phishingResult,
        portResult,
        domainResult,
      ] = await Promise.allSettled([
        API.post("/scan/summary", { url: formattedUrl }),
        API.post("/scan/headers", { url: formattedUrl }),
        API.post("/scan/phishing", { url: formattedUrl }),
        API.post("/scan/ports", { url: formattedUrl }),
        API.post("/scan/domain", { url: formattedUrl }),
      ]);

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value.data.summary);
      }

      if (headersResult.status === "fulfilled") {
        setResults(headersResult.value.data.headers);
        setRawHeaders(headersResult.value.data.raw_headers || null);
      }

      if (phishingResult.status === "fulfilled") {
        setPhishingResult(phishingResult.value.data.result);
      }

      if (portResult.status === "fulfilled") {
        setPorts(portResult.value.data.ports);
      }

      if (domainResult.status === "fulfilled") {
        setDomainInfo(domainResult.value.data.info);
      }

      const failedScan = [
        summaryResult,
        headersResult,
        phishingResult,
        portResult,
        domainResult,
      ].find((result) => result.status === "rejected");

      if (failedScan) {
        const reason = failedScan.reason;
        setError(
          reason?.response?.data?.error ||
            reason?.message ||
            "One or more scan requests failed"
        );
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to scan website");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-4xl mx-auto mt-10 px-5">

      <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-8 shadow-2xl shadow-green-500/10">

        <h1 className="text-4xl font-bold mb-4 text-white">
          Security Header Scanner
        </h1>

        <p className="text-slate-400 mb-8">
          Analyze websites for missing security headers and phishing indicators.
        </p>

        <div className="flex gap-4 flex-col md:flex-row">

          <input
            type="text"
            placeholder="google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-green-400 focus:shadow-lg focus:shadow-green-500/20 rounded-xl px-4 py-4 text-white outline-none transition-all duration-300"
          />

          <button
            onClick={handleScan}
            className="bg-green-500 hover:bg-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 px-6 py-4 rounded-xl font-semibold text-black"
          >
            Scan
          </button>

        </div>

        {error && (

          <p className="text-red-400 mt-4">
            {error}
          </p>

        )}

      </div>

      {loading && <Loader />}

      {summary && <AISummaryCard summary={summary} />}

      {results && (
        <>
          <div className="grid gap-4 mt-10">
            {Object.entries(results).map(([key, value]) => (
              <ResultCard key={key} title={key} status={value} />
            ))}
          </div>

          <TerminalPanel results={results} url={url} rawHeaders={rawHeaders} />
        </>
      )}

      {phishingResult && <PhishingCard result={phishingResult} />}

      {ports && ports.length > 0 && <PortScanCard ports={ports} />}

      {domainInfo && <WhoisCard info={domainInfo} />}

    </div>

  );
};

export default ScanForm;