import { useState, useEffect } from "react";
import { FiShield, FiCpu } from "react-icons/fi";

const Loader = () => {
  const steps = [
    "Initializing VulnX threat intelligence audit engine...",
    "Interrogating target HTTP headers & security policies...",
    "Inspecting SSL/TLS certificate chain & encryption ciphers...",
    "Auditing DNS records & verifying SPF/DMARC anti-spoofing...",
    "Executing concurrent TCP port scan & service detection...",
    "Geolocating target IP infrastructure & technology stack...",
    "Analyzing CORS, sensitive endpoints & synthesizing findings..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 550);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-8 glass-panel p-8 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
      
      {/* Hacker Radar Scan Effect */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-emerald-500/25"></div>
        <div className="absolute inset-4 rounded-full border border-emerald-500/40"></div>
        <div className="absolute inset-8 rounded-full border border-emerald-500/60"></div>
        
        <div className="absolute inset-0 rounded-full animate-radar origin-center bg-gradient-to-tr from-emerald-500/40 via-transparent to-transparent"></div>
        
        <div className="w-6 h-6 rounded-full bg-emerald-400/40 animate-ping"></div>
        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/60 flex items-center justify-center absolute shadow-[0_0_15px_rgba(0,255,102,0.3)]">
          <FiShield className="text-emerald-400 text-lg" />
        </div>
      </div>

      <h3 className="text-base font-bold text-emerald-400 tracking-wide font-mono flex items-center gap-2 neon-text-green">
        <FiCpu className="text-emerald-400" /> ACTIVE SECURITY SCAN IN PROGRESS
      </h3>

      <div className="mt-4 px-5 py-3 bg-slate-950/90 rounded-xl border border-emerald-500/40 text-xs font-mono text-emerald-300 max-w-xl w-full flex items-center justify-center gap-2.5 shadow-inner">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
        <span className="truncate">{steps[currentStepIndex]}</span>
      </div>

      <div className="w-full max-w-sm mt-6 font-mono">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold">
          <span>PROGRESS</span>
          <span className="text-emerald-400">{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-emerald-500/40">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300 shadow-[0_0_12px_rgba(0,255,102,0.5)]"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;