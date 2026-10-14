import React, { useState } from 'react';
import { POBOrder, Product, Chemist, User } from '../../types';
import { Badge } from '../common/Badge';
import { ShoppingCart, Plus, FileText, Printer, X, Download } from 'lucide-react';
import { ERPIntegrationService } from '../../services/erpIntegrationService';

interface POBOrderBookingProps {
  products: Product[];
  chemists: Chemist[];
  currentUser: User;
}

export const POBOrderBooking: React.FC<POBOrderBookingProps> = ({
  products = [],
  chemists = [],
  currentUser,
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeChemists = Array.isArray(chemists) ? chemists : [];

  const [orders, setOrders] = useState<POBOrder[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChemistId, setSelectedChemistId] = useState(safeChemists[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(safeProducts[0]?.id || '');
  const [orderQty, setOrderQty] = useState(10);
  const [freeQty, setFreeQty] = useState(1);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<POBOrder | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const chem = safeChemists.find(c => c.id === selectedChemistId) || safeChemists[0];
    const prod = safeProducts.find(p => p.id === selectedProductId) || safeProducts[0];

    if (!chem || !prod) {
      alert('Please ensure chemists and products are available.');
      return;
    }

    const rate = prod.ptr || 135;
    const subTotal = orderQty * rate;
    const gst = subTotal * 0.12; // 12% GST

    const newOrder: POBOrder = {
      id: `pob-${Date.now()}`,
      orderNumber: `POB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      chemistOrStockistId: chem.id,
      buyerName: chem.shopName,
      buyerType: 'CHEMIST',
      territoryName: currentUser.territoryName,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '2026-09-08',
      items: [
        {
          productId: prod.id,
          productName: prod.brandName || prod.name,
          packSize: prod.packSize || 'Standard',
          quantity: orderQty,
          freeQuantity: freeQty,
          rate,
          totalAmount: subTotal,
        }
      ],
      subTotal,
      gstAmount: gst,
      grandTotal: subTotal + gst,
      status: 'BOOKED',
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5 border border-[#282319] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
              <ShoppingCart className="w-4 h-4 text-[#B99D73]" />
            </div>
            Product Order Booking (POB) Engine
          </h2>
          <p className="text-xs text-[#857866] mt-1">
            Book secondary sales orders with chemist bonus schemes, calculate PTR taxes, and generate invoices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="neu-btn-gold flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Book New Order
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="neu-card border border-[#282319] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#181712] border border-[#282319] text-[#B99D73] mx-auto flex items-center justify-center shadow-neu-sunken">
            <ShoppingCart className="w-6 h-6 text-[#B99D73]" />
          </div>
          <h3 className="font-bold text-[#F2ECE1] text-sm">No POB Orders Booked Yet</h3>
          <p className="text-xs text-[#857866] max-w-sm mx-auto">
            Click "Book New Order" to record product orders booked directly at chemist counters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="neu-card border border-[#282319] p-5 space-y-4 hover:border-[#6C5636]/60 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#282319]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#F2ECE1]">{ord.buyerName}</h3>
                    <Badge variant="primary">{ord.orderNumber}</Badge>
                    <Badge variant="success">{ord.status}</Badge>
                  </div>
                  <p className="text-xs text-[#857866] mt-1">
                    Booked by: <strong className="text-[#F2ECE1]">{ord.userName}</strong> • Order Date: {ord.orderDate} • Delivery Target: {ord.expectedDeliveryDate}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => setSelectedOrderReceipt(ord)}
                    className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#B99D73] hover:text-[#F2ECE1] font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Receipt
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0c0c09] text-[#857866] uppercase font-semibold border-b border-[#282319]">
                    <tr>
                      <th className="p-2.5">Product SKU</th>
                      <th className="p-2.5">Pack</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Free Scheme</th>
                      <th className="p-2.5">Rate (PTR)</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282319]">
                    {ord.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#181712]/50">
                        <td className="p-2.5 font-semibold text-[#F2ECE1]">{item.productName}</td>
                        <td className="p-2.5 text-[#857866]">{item.packSize}</td>
                        <td className="p-2.5 font-mono font-bold text-[#F2ECE1]">{item.quantity}</td>
                        <td className="p-2.5 font-mono text-[#A6C48A] font-semibold">+{item.freeQuantity} Free</td>
                        <td className="p-2.5 font-mono text-[#857866]">₹{item.rate.toFixed(2)}</td>
                        <td className="p-2.5 font-mono font-bold text-[#B99D73] text-right">₹{item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Footer */}
              <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-6 text-xs">
                <div>
                  <span className="text-[#857866]">Subtotal:</span>{' '}
                  <span className="font-mono font-semibold text-[#F2ECE1]">₹{ord.subTotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[#857866]">GST (12%):</span>{' '}
                  <span className="font-mono font-semibold text-[#F2ECE1]">₹{ord.gstAmount.toFixed(2)}</span>
                </div>
                <div className="bg-[#181712] border border-[#282319] px-3.5 py-1.5 rounded-xl font-bold text-[#B99D73] text-sm shadow-neu-sunken">
                  Grand Total: ₹{ord.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card border border-[#282319] max-w-lg w-full p-6 shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
              <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#B99D73]" />
                Book Secondary Sales Order (POB)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Select Chemist Outlet</label>
                {safeChemists.length === 0 ? (
                  <p className="text-xs text-[#857866]">No chemists registered.</p>
                ) : (
                  <select
                    value={selectedChemistId}
                    onChange={(e) => setSelectedChemistId(e.target.value)}
                    className="neu-input w-full px-3 py-2 bg-[#0c0c09] cursor-pointer"
                  >
                    {safeChemists.map(c => (
                      <option key={c.id} value={c.id}>{c.shopName} ({c.name})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Select Product</label>
                {safeProducts.length === 0 ? (
                  <p className="text-xs text-[#857866]">No products available.</p>
                ) : (
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="neu-input w-full px-3 py-2 bg-[#0c0c09] cursor-pointer"
                  >
                    {safeProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.brandName || p.name} (PTR: ₹{p.ptr?.toFixed(2) || '135.00'})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Order Quantity (Boxes/Strips)</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value) || 1)}
                    className="neu-input w-full px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Free Scheme Bonus Units</label>
                  <input
                    type="number"
                    min="0"
                    value={freeQty}
                    onChange={(e) => setFreeQty(parseInt(e.target.value) || 0)}
                    className="neu-input w-full px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl font-bold cursor-pointer"
                >
                  Confirm & Book Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-50 bg-[#090907]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card border border-[#282319] max-w-lg w-full p-6 shadow-neu-raised space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#B99D73]">Order Booking Receipt</span>
                <h3 className="font-bold text-base text-[#F2ECE1]">{selectedOrderReceipt.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrderReceipt(null)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#0c0c09] border border-[#282319] rounded-xl space-y-1 text-[#857866] shadow-neu-sunken">
              <p><strong className="text-[#F2ECE1]">Billed To:</strong> {selectedOrderReceipt.buyerName}</p>
              <p><strong className="text-[#F2ECE1]">Booking Rep:</strong> {selectedOrderReceipt.userName}</p>
              <p><strong className="text-[#F2ECE1]">Territory:</strong> {selectedOrderReceipt.territoryName}</p>
              <p><strong className="text-[#F2ECE1]">Order Date:</strong> {selectedOrderReceipt.orderDate}</p>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {selectedOrderReceipt.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-[#282319] text-[#F2ECE1]">
                  <span>{item.productName} ({item.quantity} + {item.freeQuantity} Free)</span>
                  <span className="font-mono font-bold text-[#B99D73]">₹{item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right font-bold text-sm text-[#B99D73]">
              Total Payable: ₹{selectedOrderReceipt.grandTotal.toFixed(2)}
            </div>

            <div className="pt-3.5 border-t border-[#282319] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const xml = ERPIntegrationService.exportToTallyXML(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(xml, `${selectedOrderReceipt.orderNumber}_Tally.xml`, 'application/xml');
                  }}
                  className="neu-btn px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#B99D73] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Tally Prime XML
                </button>
                <button
                  onClick={() => {
                    const csv = ERPIntegrationService.exportToMargCSV(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(csv, `${selectedOrderReceipt.orderNumber}_Marg.csv`, 'text/csv');
                  }}
                  className="neu-btn px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#D4BD95] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Marg ERP
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="neu-btn px-3 py-1.5 rounded-xl flex items-center gap-1 text-[#857866] hover:text-[#F2ECE1] font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedOrderReceipt(null)}
                  className="neu-btn-gold px-4 py-1.5 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
