import { useEffect, useState } from "react";
import api from "../api";
import { Plus, Trash2, Printer } from "lucide-react";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    try {
      const [salesRes, itemsRes] = await Promise.all([
        api.get("/sales"),
        api.get("/items")
      ]);
      setSales(salesRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = () => {
    if (!selectedItem || quantity <= 0) return;
    
    const item = items.find(i => i._id === selectedItem);
    if (!item) return;
    
    if (quantity > item.Quantity) {
      alert(`Insufficient stock! Available: ${item.Quantity}`);
      return;
    }
    
    const existingItem = cart.find(c => c.item_id === selectedItem);
    if (existingItem) {
      if (existingItem.QuantitySold + quantity > item.Quantity) {
        alert(`Insufficient stock! Available: ${item.Quantity}`);
        return;
      }
      setCart(cart.map(c => 
        c.item_id === selectedItem 
          ? { ...c, QuantitySold: c.QuantitySold + quantity, SubTotalPrice: (c.QuantitySold + quantity) * item.UnitPrice }
          : c
      ));
    } else {
      setCart([...cart, {
        item_id: item._id,
        ItemName: item.ItemName,
        QuantitySold: quantity,
        UnitPrice: item.UnitPrice,
        SubTotalPrice: quantity * item.UnitPrice
      }]);
    }
    
    setSelectedItem("");
    setQuantity(1);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmitSale = async () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (cart.length === 0) {
      alert("Please add items to the sale");
      return;
    }
    
    try {
      await api.post("/sales", {
        CustomerName: customerName,
        items: cart.map(item => ({
          item_id: item.item_id,
          QuantitySold: item.QuantitySold
        }))
      });
      
      setShowModal(false);
      setCart([]);
      setCustomerName("");
      fetchData();
      alert("Sale completed successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error processing sale");
    }
  };

  const viewSaleDetails = async (saleId) => {
    try {
      const res = await api.get(`/sales/${saleId}`);
      setSelectedSale(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.SubTotalPrice, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Sales Management</h1>
          <p className="text-black/60">Record and manage sales transactions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} /> New Sale
        </button>
      </div>

      {loading ? (
        <p className="text-black/60">Loading sales...</p>
      ) : (
        <div className="bg-white/5 rounded-xl overflow-hidden border border-black/10">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-black/80">Date</th>
                <th className="p-3 text-black/80">Customer Name</th>
                <th className="p-3 text-black/80">Total Price (RWF)</th>
                <th className="p-3 text-black/80">Recorded By</th>
                <th className="p-3 text-black/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="border-b border-black/10">
                  <td className="p-3 text-black/70">{new Date(sale.SaleDate).toLocaleDateString()}</td>
                  <td className="p-3 font-medium text-black">{sale.CustomerName}</td>
                  <td className="p-3 text-black/70">{sale.TotalPrice.toLocaleString()} RWF</td>
                  <td className="p-3 text-black/70">{sale.user_id?.UserName || "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => viewSaleDetails(sale._id)}
                      className="text-black/70 hover:text-black transition"
                    >
                      View Details
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      )}

      {selectedSale && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-black/20 rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-black mb-4">Sale Details</h2>
            <p className="text-black/80"><strong className="text-black">Customer:</strong> {selectedSale.sale.CustomerName}</p>
            <p className="text-black/80"><strong className="text-black">Date:</strong> {new Date(selectedSale.sale.SaleDate).toLocaleString()}</p>
            <p className="text-black/80"><strong className="text-black">Total:</strong> {selectedSale.sale.TotalPrice.toLocaleString()} RWF</p>
            
            <h3 className="text-xl font-bold text-black mt-4 mb-2">Items Sold</h3>
            <div className="bg-white/5 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-black/80">Item</th>
                    <th className="p-2 text-black/80">Quantity</th>
                    <th className="p-2 text-black/80">Unit Price</th>
                    <th className="p-2 text-black/80">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.details.map((detail, idx) => (
                    <tr key={idx} className="border-b border-black/10">
                      <td className="p-2 text-black/70">{detail.ItemName}</td>
                      <td className="p-2 text-black/70">{detail.QuantitySold}</td>
                      <td className="p-2 text-black/70">{detail.UnitPriceAtSale.toLocaleString()}</td>
                      <td className="p-2 text-black/70">{detail.SubTotalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              onClick={() => setSelectedSale(null)}
              className="mt-4 bg-white/10 hover:bg-white/20 text-black px-4 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-black border border-black/20 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-4">New Sale Transaction</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-black/80">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50 placeholder-white/40"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-black/80">Select Item</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50"
                >
                  <option value="" className="bg-black">Choose an item...</option>
                  {items.filter(i => i.Quantity > 0).map(item => (
                    <option key={item._id} value={item._id} className="bg-black">
                      {item.ItemName} - {item.UnitPrice.toLocaleString()} RWF (Stock: {item.Quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-black/80">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                  className="w-full bg-white/10 text-black px-4 py-2 rounded-lg border border-black/20 focus:outline-none focus:border-black/50"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addToCart}
                  className="w-full bg-white text-black hover:bg-white/90 py-2 rounded-lg transition font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black mb-2">Shopping Cart</h3>
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="p-2 text-black/80">Item</th>
                      <th className="p-2 text-black/80">Quantity</th>
                      <th className="p-2 text-black/80">Unit Price</th>
                      <th className="p-2 text-black/80">Subtotal</th>
                      <th className="p-2 text-black/80">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx} className="border-b border-black/10">
                        <td className="p-2 text-black/70">{item.ItemName}</td>
                        <td className="p-2 text-black/70">{item.QuantitySold}</td>
                        <td className="p-2 text-black/70">{item.UnitPrice.toLocaleString()}</td>
                        <td className="p-2 text-black/70">{item.SubTotalPrice.toLocaleString()}</td>
                        <td className="p-2">
                          <button onClick={() => removeFromCart(idx)} className="text-black/50 hover:text-black/80 transition">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-white/10">
                    <tr>
                      <td colSpan="3" className="p-2 text-right font-bold text-black/80">Total:</td>
                      <td className="p-2 font-bold text-black">{totalAmount.toLocaleString()} RWF</td>
                      <td className="p-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmitSale}
                className="flex-1 bg-white text-black hover:bg-white/90 py-2 rounded-lg transition font-semibold"
              >
                Complete Sale
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCart([]);
                  setCustomerName("");
                }}
                className="flex-1 bg-white/10 text-black hover:bg-white/20 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}