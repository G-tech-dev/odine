import { useEffect, useState } from "react";
import api from "../api";
import { Search } from "lucide-react";

export default function StockSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSummary = async () => {
    try {
      const res = await api.get("/stock/summary");
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const filteredSummary = summary.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = summary.reduce((sum, item) => sum + item.ValueInStock, 0);
  const totalItems = summary.reduce((sum, item) => sum + item.CurrentQuantity, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Stock Summary</h1>
        <p className="text-black/60">Current inventory status</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-black/10 p-4 rounded-lg text-center">
          <p className="text-black/60">Total Items in Stock</p>
          <p className="text-2xl font-bold text-black">{totalItems}</p>
        </div>
        <div className="bg-white/5 border border-black/10 p-4 rounded-lg text-center">
          <p className="text-black/60">Total Stock Value</p>
          <p className="text-2xl font-bold text-black">{totalValue.toLocaleString()} RWF</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40" size={20} />
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 text-black pl-10 pr-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-black/60">Loading summary...</p>
      ) : (
        <div className="bg-white/5 rounded-xl overflow-hidden border border-black/10">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-black/80">Item Name</th>
                <th className="p-3 text-black/80">Specification</th>
                <th className="p-3 text-black/80">Unit Measure</th>
                <th className="p-3 text-black/80">Unit Price (RWF)</th>
                <th className="p-3 text-black/80">Current Quantity</th>
                <th className="p-3 text-black/80">Value (RWF)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummary.map((item, idx) => (
                <tr key={idx} className="border-b border-black/10">
                  <td className="p-3 font-medium text-black">{item.ItemName}</td>
                  <td className="p-3 text-black/70">{item.Specification || "-"}</td>
                  <td className="p-3 text-black/70">{item.UnitMeasure || "-"}</td>
                  <td className="p-3 text-black/70">{item.UnitPrice.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={item.CurrentQuantity < 10 ? "text-black/50 font-bold" : "text-black/70"}>
                      {item.CurrentQuantity}
                    </span>
                  </td>
                  <td className="p-3 text-black/70">{item.ValueInStock.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}