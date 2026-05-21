import Navbar from "../components/Navbar";
import ScanForm from "../components/ScanForm";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <ScanForm />
    </div>
  );
};

export default Dashboard;