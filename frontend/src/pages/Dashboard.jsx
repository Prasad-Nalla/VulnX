import { useState } from "react";
import Navbar from "../components/Navbar";
import ScanForm from "../components/ScanForm";

const Dashboard = () => {
  const [presetUrl, setPresetUrl] = useState("");

  const handleQuickScan = (targetDomain) => {
    setPresetUrl(targetDomain);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
      <Navbar onQuickScan={handleQuickScan} />
      <ScanForm key={presetUrl} initialUrl={presetUrl} />
    </div>
  );
};

export default Dashboard;