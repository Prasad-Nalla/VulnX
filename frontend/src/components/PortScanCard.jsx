const PortScanCard = ({ ports }) => {
  if (!ports) return null;

  return (
    <div className="mt-6 border border-emerald-500/40 rounded-lg p-6 bg-black/95 shadow-[0_0_20px_rgba(0,255,102,0.15)] font-mono">
      <h2 className="text-xl font-bold text-emerald-400 mb-4 neon-text-green">
        [+] CONCURRENT PORT SCANNER RESULTS (NMAP PASS)
      </h2>

      {ports.length === 0 ? (
        <div className="bg-black border border-emerald-500/30 rounded p-4 text-emerald-300 text-xs">
          <p className="font-bold text-emerald-400">[✓] NO COMMON OPEN PORTS DETECTED</p>
          <p className="text-[11px] text-emerald-600 mt-1">
            Probed common service ports (FTP:21, SSH:22, SMTP:25, DNS:53, HTTP:80, POP3:110, IMAP:143, HTTPS:443, MySQL:3306, HTTP-ALT:8080).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ports.map((port, index) => (
            <div key={index} className="bg-black border border-emerald-500/30 rounded p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-emerald-300">
                  PORT {port.port}
                </h3>
                <p className="text-xs text-emerald-600 font-bold uppercase">
                  SERVICE: {port.service}
                </p>
              </div>

              <div className="bg-emerald-950 text-emerald-300 border border-emerald-500/60 px-3 py-1 rounded text-xs font-bold">
                [{port.status}]
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortScanCard;