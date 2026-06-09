import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import Dashboard from "./components/Dashboard";
import Items from "./components/Items";
import Sales from "./components/Sales";
import SaleDetails from "./components/SaleDetails";
import DailyReport from "./components/DailyReport";

// ===================== PROTECTED WRAPPER =====================
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/" />;
  return children;
}

// ===================== DASHBOARD LAYOUT =====================
function DashboardLayout() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        active={active} 
        setActive={setActive} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          setSidebarOpen={setSidebarOpen} 
          activePage={active}
        />
        
        <div className="flex-1 overflow-y-auto mt-16">
          <div className="p-6">
            {active === "dashboard" && <Dashboard />}
            {active === "items" && <Items />}
            {active === "sales" && <Sales />}
            {active === "summary" && <SaleDetails />}
            {active === "reports" && <DailyReport />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== APP =====================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}