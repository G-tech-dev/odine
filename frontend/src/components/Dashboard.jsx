import { useEffect, useState } from "react";
import api from "../api";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, salesRes] = await Promise.all([
        api.get("/items"),
        api.get("/sales"),
      ]);
      setItems(itemsRes.data);
      setSales(salesRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalItems = items.length;
  const totalStockValue = items.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.TotalPrice, 0);

  return (
    <div className="p-6 text-black bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-black">
          <TrendingUp /> SRMS Dashboard
        </h1>
        <p className="text-gray-600">Sales Records Management System Overview</p>
      </div>

      {loading && <p className="text-gray-600">Loading dashboard...</p>}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-5 rounded-xl shadow border border-gray-300">
              <div className="flex items-center justify-between">
                <Package className="text-gray-600" size={24} />
                <span className="text-2xl font-bold text-black">{totalItems}</span>
              </div>
              <p className="text-gray-600 mt-2">Total Products</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-xl shadow border border-gray-300">
              <div className="flex items-center justify-between">
                <ShoppingCart className="text-gray-600" size={24} />
                <span className="text-2xl font-bold text-black">{totalSales}</span>
              </div>
              <p className="text-gray-600 mt-2">Total Sales</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-xl shadow border border-gray-300">
              <div className="flex items-center justify-between">
                <DollarSign className="text-gray-600" size={24} />
                <span className="text-2xl font-bold text-black">{totalRevenue.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 mt-2">Total Revenue (RWF)</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-xl shadow border border-gray-300">
              <div className="flex items-center justify-between">
                <Package className="text-gray-600" size={24} />
                <span className="text-2xl font-bold text-black">{totalStockValue.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 mt-2">Inventory Value (RWF)</p>
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="mt-8 bg-white p-5 rounded-xl shadow border border-gray-300">
            <h2 className="text-xl font-bold mb-4 text-black">Recent Sales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-black">Date</th>
                    <th className="p-2 text-black">Customer</th>
                    <th className="p-2 text-black">Total (RWF)</th>
                    <th className="p-2 text-black">Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr className="border-b border-gray-200">
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No sales recorded yet
                      </td>
                    </tr>
                  ) : (
                    sales.slice(0, 5).map((sale) => (
                      <tr key={sale._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 text-gray-700">{new Date(sale.SaleDate).toLocaleDateString()}</td>
                        <td className="p-2 font-medium text-gray-900">{sale.CustomerName}</td>
                        <td className="p-2 text-gray-900">{sale.TotalPrice.toLocaleString()} RWF</td>
                        <td className="p-2 text-gray-700">{sale.user_id?.UserName || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}