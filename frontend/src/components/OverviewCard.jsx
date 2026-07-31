import API from "../services/api";
import { FiDownload, FiFileText, FiShield, FiAlertTriangle, FiCheckCircle, FiGlobe, FiLock, FiMail } from "react-icons/fi";

const OverviewCard = ({ overall, summary, url, fullData, onExportJson, onExportReport }) => {
  if (!overall) return null;

  const handleDownloadHtmlReport = async () => {
    try {
      const res = await API.post("/scan/report/download", fullData);
      if (res.data && res.data.html) {
        const blob = new Blob([res.data.html], { type: "text/html" });
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = URL.createObjectURL(blob);
        downloadAnchor.download = res.data.filename || `vulnx-audit-report.html`;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      window.print();
    }
  };

  const sqliCount = fullData?.vuln_scan?.sqli?.count || 0;
  const xssCount = fullData?.vuln_scan?.xss?.count || 0;
  const totalActiveVulns = sqliCount + xssCount;

  // Grade Color helper
  const getGradeBadge = (grade) => {
    switch (grade) {
      case "A+":
      case "A":
        return { color: "from-emerald-500 to-teal-600", text: "text-emerald-400", border: "border-emerald-500/40", shadow: "shadow-emerald-500/20" };
      case "B":
        return { color: "from-cyan-500 to-blue-600", text: "text-cyan-400", border: "border-cyan-500/40", shadow: "shadow-cyan-500/20" };
      case "C":
        return { color: "from-amber-500 to-orange-600", text: "text-amber-400", border: "border-amber-500/40", shadow: "shadow-amber-500/20" };
      default:
        return { color: "from-rose-500 to-red-600", text: "text-rose-400", border: "border-rose-500/40", shadow: "shadow-rose-500/20" };
    }
  };

  const gradeStyle = getGradeBadge(overall.grade);

  return (
    <div className="mt-6 glass-panel p-6 sm:p-8">
      
      {/* Top Console & Executive Score Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Radial Score Badge */}
          <div className={`relative flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br ${gradeStyle.color} p-0.5 shadow-xl ${gradeStyle.shadow}`}>
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold tracking-tight ${gradeStyle.text}`}>
                {overall.grade}
              </span>
              <span className="text-xs font-semibold text-slate-400 mt-0.5">
                {overall.score}/100
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                SECURITY RATING: <span className={overall.status === "PASS" ? "text-emerald-400" : "text-amber-400"}>{overall.status}</span>
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
              <FiGlobe className="text-cyan-400 text-sm" /> Target: <span className="text-white font-mono font-medium">{url}</span>
            </p>
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-1 justify-center sm:justify-start font-mono">
              Final Endpoint: <span className="text-slate-300">{fullData?.final_url || url}</span> (HTTP {fullData?.status_code || 200})
            </p>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex sm:flex-row flex-col gap-3 w-full lg:w-auto">
          <button
            onClick={onExportJson}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <FiFileText className="text-emerald-400 text-sm" /> Export JSON
          </button>
          <button
            onClick={handleDownloadHtmlReport}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            <FiDownload className="text-slate-950 text-sm" /> Download Audit Report
          </button>
        </div>
      </div>

      {/* Security Assessment Executive Summary */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2 font-mono">
          <FiShield className="text-emerald-400" /> Security Assessment Overview
        </h3>
        <p className="text-emerald-200 text-sm leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-emerald-500/30 font-mono">
          {summary}
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mt-6 font-mono">
        
        <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">HTTP Headers</span>
            <FiShield className="text-emerald-400" />
          </div>
          <p className="text-base font-bold text-emerald-300 mt-2">
            {fullData?.headers ? `${Object.values(fullData.headers).filter(v => v !== "Missing").length}/${Object.keys(fullData.headers).length}` : "Audited"}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">SSL Certificate</span>
            <FiLock className={fullData?.ssl?.is_valid ? "text-emerald-400" : "text-rose-400"} />
          </div>
          <p className={`text-base font-bold mt-2 ${fullData?.ssl?.is_valid ? "text-emerald-400" : "text-rose-400"}`}>
            {fullData?.ssl?.is_valid ? "Valid SSL" : "SSL Risk"}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Active Threats</span>
            <FiAlertTriangle className={totalActiveVulns > 0 ? "text-rose-400" : "text-emerald-400"} />
          </div>
          <p className={`text-base font-bold mt-2 ${totalActiveVulns > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {totalActiveVulns > 0 ? `${totalActiveVulns} Found` : "0 Threats"}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Mail Spoofing</span>
            <FiMail className={fullData?.dns?.email_security?.spf_configured ? "text-emerald-400" : "text-amber-400"} />
          </div>
          <p className={`text-base font-bold mt-2 ${fullData?.dns?.email_security?.spf_configured ? "text-emerald-400" : "text-amber-400"}`}>
            {fullData?.dns?.email_security?.spf_configured ? "Protected" : "No SPF"}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Phishing Risk</span>
            <FiCheckCircle className={fullData?.phishing?.verdict === "SAFE" ? "text-emerald-400" : "text-rose-400"} />
          </div>
          <p className={`text-base font-bold mt-2 ${fullData?.phishing?.verdict === "SAFE" ? "text-emerald-400" : "text-rose-400"}`}>
            {fullData?.phishing?.verdict || "SAFE"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default OverviewCard;

