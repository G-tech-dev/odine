import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    ItemName: "",
    Specification: "",
    UnitMeasure: "",
    Quantity: 0,
    UnitPrice: 0,
    TotalQuantity: 0
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/items/${editingItem._id}`, formData);
      } else {
        await api.post("/items", formData);
      }
      fetchItems();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error saving item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.msg || "Error deleting item");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ItemName: item.ItemName,
      Specification: item.Specification || "",
      UnitMeasure: item.UnitMeasure || "",
      Quantity: item.Quantity,
      UnitPrice: item.UnitPrice,
      TotalQuantity: item.TotalQuantity
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      ItemName: "",
      Specification: "",
      UnitMeasure: "",
      Quantity: 0,
      UnitPrice: 0,
      TotalQuantity: 0
    });
  };

  const filteredItems = items.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Specification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Items Management</h1>
          <p className="text-black/60">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40" size={20} />
          <input
            type="text"
            placeholder="Search items by name or specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 text-black pl-10 pr-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-black/60">Loading items...</p>
      ) : (
        <div className="bg-white/5 rounded-xl overflow-hidden border border-black/10">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-black/80">Item Name</th>
                <th className="p-3 text-black/80">Specification</th>
                <th className="p-3 text-black/80">Unit Measure</th>
                <th className="p-3 text-black/80">Quantity</th>
                <th className="p-3 text-black/80">Unit Price (RWF)</th>
                <th className="p-3 text-black/80">Total Value</th>
                <th className="p-3 text-black/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="border-b border-black/10">
                  <td className="p-3 font-medium text-black">{item.ItemName}</td>
                  <td className="p-3 text-black/70">{item.Specification || "-"}</td>
                  <td className="p-3 text-black/70">{item.UnitMeasure || "-"}</td>
                  <td className="p-3 text-black/70">{item.Quantity}</td>
                  <td className="p-3 text-black/70">{item.UnitPrice.toLocaleString()}</td>
                  <td className="p-3 text-black/70">{(item.Quantity * item.UnitPrice).toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-black/70 hover:text-black mr-3 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-black/50 hover:text-black/80 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-black/20 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.ItemName}
                  onChange={(e) => setFormData({ ...formData, ItemName: e.target.value })}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                  required
                />
                <input
                  type="text"
                  placeholder="Specification"
                  value={formData.Specification}
                  onChange={(e) => setFormData({ ...formData, Specification: e.target.value })}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                />
                <input
                  type="text"
                  placeholder="Unit Measure (e.g., pcs, kg, m)"
                  value={formData.UnitMeasure}
                  onChange={(e) => setFormData({ ...formData, UnitMeasure: e.target.value })}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                />
                <input
                  type="number"
                  placeholder="Initial Quantity"
                  value={formData.Quantity}
                  onChange={(e) => setFormData({ ...formData, Quantity: parseInt(e.target.value) })}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                />
                <input
                  type="number"
                  placeholder="Unit Price (RWF)"
                  value={formData.UnitPrice}
                  onChange={(e) => setFormData({ ...formData, UnitPrice: parseInt(e.target.value) })}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="flex-1 bg-white text-black hover:bg-white/90 py-2 rounded-lg transition font-semibold">
                  {editingItem ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white/10 text-black hover:bg-white/20 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}