import { useState } from "react";
import { Menu, Bell, User, Search, LogOut, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ setSidebarOpen, activePage }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get page title based on active page
  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      items: "Items Management",
      sales: "Sales Management",
      summary: "Sales Details",
      reports: "Daily Reports"
    };
    return titles[activePage] || "SRMS";
  };

  return (
    <div className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Menu button and Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-xs text-gray-500">Sales Records Management System</p>
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <div className="bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user.user_name || user.UserName || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_name || user.UserName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}