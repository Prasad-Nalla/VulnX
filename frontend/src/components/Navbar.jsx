import { FiShield, FiActivity } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="w-full sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">

      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shadow-lg shadow-green-500/10">
            <FiShield className="text-green-400 text-2xl" />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-wide text-white">
              VulnX
            </h1>

            <p className="text-slate-400 text-sm">
              Advanced Web Vulnerability Scanner
            </p>
          </div>

        </div>

        <div className="hidden md:flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <FiActivity className="text-green-400" />
          <span className="text-slate-300 text-sm font-medium">
            Real-Time Threat Analysis
          </span>
        </div>

      </div>

    </div>
  );
};

export default Navbar;