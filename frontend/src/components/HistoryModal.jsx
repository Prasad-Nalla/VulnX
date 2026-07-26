import { useEffect, useState } from "react";
import API from "../services/api";
import { FiClock, FiX, FiRefreshCw, FiExternalLink } from "react-icons/fi";

const HistoryModal = ({ isOpen, onClose, onSelectTarget }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/scan/history");
      if (res.data && res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      setError("Failed to fetch scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-black border border-emerald-500/60 rounded-lg max-w-2xl w-full p-6 shadow-[0_0_30px_rgba(0,255,102,0.25)] relative text-emerald-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/40">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <FiClock className="text-emerald-400 text-lg animate-pulse" />
            <span>[+] KALI SCAN HISTORY LOGS (SQLite)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchHistory}
              className="text-xs text-emerald-500 hover:text-emerald-300 flex items-center gap-1"
              title="Refresh logs"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={onClose}
              className="text-emerald-500 hover:text-emerald-300 p-1"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 max-h-96 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-emerald-500 animate-pulse">
              [+] RETRIEVING RECENT AUDIT LOGS...
            </div>
          ) : error ? (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-400 text-xs rounded">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-600">
              No scan history records found in local database.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTarget(item.url);
                    onClose();
                  }}
                  className="bg-emerald-950/30 hover:bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400 rounded p-3 flex items-center justify-between cursor-pointer transition-all text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-300">{item.url}</span>
                      <FiExternalLink className="text-emerald-600 text-xs" />
                    </div>
                    <span className="text-[10px] text-emerald-600 mt-1 block">
                      {item.scanned_at}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      item.score >= 80 ? "bg-emerald-950 text-emerald-400 border-emerald-500/60" :
                      item.score >= 60 ? "bg-amber-950 text-amber-400 border-amber-500/60" :
                      "bg-red-950 text-red-400 border-red-500/60"
                    }`}>
                      GRADE {item.grade} ({item.score}/100)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-emerald-500/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-xs text-emerald-300 rounded font-bold transition-all"
          >
            CLOSE LOGS
          </button>
        </div>

      </div>
    </div>
  );
};

export default HistoryModal;
