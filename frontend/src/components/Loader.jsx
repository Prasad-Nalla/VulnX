import { useState, useEffect } from "react";

const Loader = () => {
  const steps = [
    "Establishing secure socket connection to target...",
    "Auditing Security Response Headers (CSP, HSTS, X-Frame)...",
    "Inspecting SSL/TLS Certificate chain & cipher suites...",
    "Querying DNS Cloudflare DoH & validating SPF/DMARC records...",
    "Probing common service ports (FTP, SSH, HTTP, HTTPS, MySQL)...",
    "Running threat heuristics & phishing pattern analysis...",
    "Synthesizing threat intelligence & generating remediation guide..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-10 border border-cyan-500/30 rounded-3xl p-10 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
      
      {/* Background Radar Effect */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20"></div>
        <div className="absolute inset-3 rounded-full border border-cyan-500/30"></div>
        <div className="absolute inset-6 rounded-full border border-cyan-500/40"></div>
        
        {/* Radar Sweeping Hand */}
        <div className="absolute inset-0 rounded-full animate-radar origin-center bg-gradient-to-tr from-cyan-500/40 via-transparent to-transparent"></div>
        
        {/* Glowing Center Core */}
        <div className="w-6 h-6 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
        <div className="w-4 h-4 rounded-full bg-emerald-400 absolute"></div>
      </div>

      <h3 className="text-xl font-bold text-white tracking-wide">
        Running Deep Cyber Security Audit
      </h3>

      <div className="mt-4 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 max-w-lg w-full flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="truncate">{steps[currentStepIndex]}</span>
      </div>

      <div className="w-64 bg-slate-950 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;