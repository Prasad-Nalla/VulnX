import { FiShield, FiActivity, FiTerminal } from "react-icons/fi";

const Navbar = ({ onQuickScan }) => {
  return (
    <div className="w-full sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <FiShield className="text-cyan-400 text-2xl" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-wide text-white">
                VulnX
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                PRO v2.0
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Automated Security Intelligence & Vulnerability Audit Toolkit
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Demo Targets:</span>
          <button
            onClick={() => onQuickScan && onQuickScan("google.com")}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-all"
          >
            google.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("badssl.com")}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-all"
          >
            badssl.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("example.com")}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-all"
          >
            example.com
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
            <FiActivity className="text-emerald-400" /> API Engine Online
          </span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;