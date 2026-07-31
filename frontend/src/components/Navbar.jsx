import { FiShield, FiGlobe, FiActivity, FiZap, FiTerminal } from "react-icons/fi";

const Navbar = ({ onQuickScan }) => {
  return (
    <header className="w-full sticky top-0 z-50 bg-slate-950/90 border-b border-emerald-500/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.25)]">
            <FiTerminal className="text-emerald-400 text-xl" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                Vuln<span className="text-emerald-400 neon-text-green">X</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 tracking-wide uppercase shadow-[0_0_8px_rgba(0,255,102,0.2)]">
                Cyber Suite
              </span>
            </div>
            <p className="text-emerald-600/90 text-xs hidden sm:block font-mono">
              [Web Vulnerability & Threat Intelligence Engine]
            </p>
          </div>
        </div>

        {/* Quick Target Presets */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-emerald-500/80 font-mono font-medium mr-1 flex items-center gap-1">
            <FiZap className="text-emerald-400" /> Presets:
          </span>
          <button
            onClick={() => onQuickScan && onQuickScan("google.com")}
            className="px-3 py-1 bg-slate-900/90 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiGlobe className="text-xs text-emerald-400" /> google.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("badssl.com")}
            className="px-3 py-1 bg-slate-900/90 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiShield className="text-xs text-amber-400" /> badssl.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("example.com")}
            className="px-3 py-1 bg-slate-900/90 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiGlobe className="text-xs text-emerald-400" /> example.com
          </button>
        </div>

        {/* API Status Badge */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 rounded-full px-3.5 py-1 shadow-[0_0_12px_rgba(0,255,102,0.15)]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </div>
          <span className="text-emerald-400 text-xs font-mono font-bold tracking-wide flex items-center gap-1">
            <FiActivity className="text-xs" /> ENGINE ONLINE
          </span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;