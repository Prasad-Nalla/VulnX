import { useState, useEffect } from "react";

const Loader = () => {
  const steps = [
    "[+] Launching Kali Linux vulnerability audit framework...",
    "[+] Interrogating target socket & HTTP headers...",
    "[+] Inspecting SSL/TLS handshake & cipher suites...",
    "[+] Querying DNS records & verifying SPF/DMARC anti-spoofing...",
    "[+] Executing concurrent TCP port scan (21, 22, 80, 443, 3306)...",
    "[+] Geolocating IP address & fingerprinting tech stack...",
    "[+] Synthesizing threat intelligence & generating remediation code..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 550);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-8 border border-emerald-500/50 rounded-lg p-8 bg-black/95 shadow-[0_0_30px_rgba(0,255,102,0.2)] flex flex-col items-center justify-center text-center relative overflow-hidden">
      
      {/* Kali Radar Effect */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-emerald-500/30"></div>
        <div className="absolute inset-3 rounded-full border border-emerald-500/50"></div>
        <div className="absolute inset-6 rounded-full border border-emerald-500/70"></div>
        
        <div className="absolute inset-0 rounded-full animate-radar origin-center bg-gradient-to-tr from-emerald-500/40 via-transparent to-transparent"></div>
        
        <div className="w-5 h-5 rounded-full bg-emerald-400 animate-ping"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-300 absolute"></div>
      </div>

      <h3 className="text-lg font-bold font-mono text-emerald-400 tracking-wider neon-text-green">
        root@kali:~# nmap -sV -sC -A --script=vuln target
      </h3>

      <div className="mt-4 px-4 py-3 bg-emerald-950/60 rounded border border-emerald-500/40 font-mono text-xs text-emerald-300 max-w-xl w-full flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="truncate">{steps[currentStepIndex]}</span>
      </div>

      <div className="w-64 bg-black h-2 rounded mt-6 overflow-hidden border border-emerald-500/40">
        <div 
          className="h-full bg-emerald-400 transition-all duration-300 shadow-[0_0_10px_#00ff66]"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Loader;