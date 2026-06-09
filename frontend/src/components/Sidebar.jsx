import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileText
} from "lucide-react";

export default function Sidebar({ active, setActive, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "items", label: "Items", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "summary", label: "Sales Details", icon: BarChart3 },
    { id: "reports", label: "Daily Reports", icon: FileText },
  ];

  return (
    <>
      {/* Mobile overlay - pure black/white */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - pure black and white */}
      <div className={`fixed lg:relative z-30 w-64 bg-black text-white flex flex-col transition-transform duration-300 h-full ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-6 border-b border-black/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-white" size={28} />
            <div>
              <h1 className="text-xl font-bold text-white">SRMS</h1>
              <p className="text-xs text-white/60">Sales Records Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active === item.id
                    ? "bg-white text-black"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}