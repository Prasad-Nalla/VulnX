import { FiTerminal, FiGlobe, FiShield, FiExternalLink } from "react-icons/fi";

const Navbar = ({ onQuickScan }) => {
  return (
    <div className="w-full sticky top-0 z-50 bg-black/90 border-b border-emerald-500/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-950 border border-emerald-500/60 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.25)]">
            <FiTerminal className="text-emerald-400 text-xl animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-wider text-emerald-400 neon-text-green">
                root@kali:~/vulnx#
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                v2.0-KALI
              </span>
            </div>
            <p className="text-emerald-600 text-xs font-mono">
              [Kali Linux Console Security Audit & Vulnerability Engine]
            </p>
          </div>
        </div>

        {/* Preset Target Quick-Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-emerald-600 font-mono font-bold">Presets:</span>
          <button
            onClick={() => onQuickScan && onQuickScan("google.com")}
            className="px-3 py-1 bg-black hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 rounded font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-[0_0_10px_rgba(0,255,102,0.3)]"
          >
            <FiGlobe className="text-xs text-emerald-500" /> google.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("badssl.com")}
            className="px-3 py-1 bg-black hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 rounded font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-[0_0_10px_rgba(0,255,102,0.3)]"
          >
            <FiShield className="text-xs text-emerald-500" /> badssl.com
          </button>
          <button
            onClick={() => onQuickScan && onQuickScan("example.com")}
            className="px-3 py-1 bg-black hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 rounded font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-[0_0_10px_rgba(0,255,102,0.3)]"
          >
            <FiExternalLink className="text-xs text-emerald-500" /> example.com
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2.5 bg-black border border-emerald-500/40 rounded px-3 py-1.5 shadow-[0_0_10px_rgba(0,255,102,0.15)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-emerald-400 text-xs font-mono font-bold">
            STATUS: ONLINE
          </span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;