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
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4 text-[#137F83]" />
            </div>
            Product Order Booking (POB) Engine
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Book secondary sales orders with chemist bonus schemes, calculate PTR taxes, and generate invoices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white transition-all shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Book New Order
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="neu-card border border-[#DCE4EB] bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] mx-auto flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-[#137F83]" />
          </div>
          <h3 className="font-bold text-[#10243A] text-sm">No POB Orders Booked Yet</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Click "Book New Order" to record product orders booked directly at chemist counters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="neu-card border border-[#DCE4EB] bg-white p-5 space-y-4 hover:border-teal-500/50 shadow-xs transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#DCE4EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#10243A]">{ord.buyerName}</h3>
                    <Badge variant="primary">{ord.orderNumber}</Badge>
                    <Badge variant="success">{ord.status}</Badge>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Booked by: <strong className="text-[#10243A]">{ord.userName}</strong> • Order Date: {ord.orderDate} • Delivery Target: {ord.expectedDeliveryDate}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => setSelectedOrderReceipt(ord)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-[#137F83] hover:text-[#10243A] bg-teal-50 border border-teal-200 font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Receipt
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F1F6F8] text-[#10243A] uppercase font-semibold border-b border-[#DCE4EB]">
                    <tr>
                      <th className="p-2.5">Product SKU</th>
                      <th className="p-2.5">Pack</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Free Scheme</th>
                      <th className="p-2.5">Rate (PTR)</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE4EB]">
                    {ord.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC]">
                        <td className="p-2.5 font-semibold text-[#10243A]">{item.productName}</td>
                        <td className="p-2.5 text-[#64748B]">{item.packSize}</td>
                        <td className="p-2.5 font-mono font-bold text-[#10243A]">{item.quantity}</td>
                        <td className="p-2.5 font-mono text-emerald-600 font-semibold">+{item.freeQuantity} Free</td>
                        <td className="p-2.5 font-mono text-[#64748B]">₹{item.rate.toFixed(2)}</td>
                        <td className="p-2.5 font-mono font-bold text-[#137F83] text-right">₹{item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Footer */}
              <div className="pt-3.5 border-t border-[#DCE4EB] flex items-center justify-end gap-6 text-xs">
                <div>
                  <span className="text-[#64748B]">Subtotal:</span>{' '}
                  <span className="font-mono font-semibold text-[#10243A]">₹{ord.subTotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[#64748B]">GST (12%):</span>{' '}
                  <span className="font-mono font-semibold text-[#10243A]">₹{ord.gstAmount.toFixed(2)}</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-xl font-bold text-[#137F83] text-sm">
                  Grand Total: ₹{ord.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#137F83]" />
                Book Secondary Sales Order (POB)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Select Chemist Outlet</label>
                {safeChemists.length === 0 ? (
                  <p className="text-xs text-[#64748B]">No chemists registered.</p>
                ) : (
                  <select
                    value={selectedChemistId}
                    onChange={(e) => setSelectedChemistId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    {safeChemists.map(c => (
                      <option key={c.id} value={c.id}>{c.shopName} ({c.name})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Select Product</label>
                {safeProducts.length === 0 ? (
                  <p className="text-xs text-[#64748B]">No products available.</p>
                ) : (
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    {safeProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.brandName || p.name} (PTR: ₹{p.ptr?.toFixed(2) || '135.00'})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Order Quantity (Boxes/Strips)</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Free Scheme Bonus Units</label>
                  <input
                    type="number"
                    min="0"
                    value={freeQty}
                    onChange={(e) => setFreeQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#DCE4EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#137F83]">Order Booking Receipt</span>
                <h3 className="font-bold text-base text-[#10243A]">{selectedOrderReceipt.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrderReceipt(null)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] border border-[#DCE4EB] rounded-xl space-y-1 text-[#64748B]">
              <p><strong className="text-[#10243A]">Billed To:</strong> {selectedOrderReceipt.buyerName}</p>
              <p><strong className="text-[#10243A]">Booking Rep:</strong> {selectedOrderReceipt.userName}</p>
              <p><strong className="text-[#10243A]">Territory:</strong> {selectedOrderReceipt.territoryName}</p>
              <p><strong className="text-[#10243A]">Order Date:</strong> {selectedOrderReceipt.orderDate}</p>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {selectedOrderReceipt.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-[#DCE4EB] text-[#10243A]">
                  <span>{item.productName} ({item.quantity} + {item.freeQuantity} Free)</span>
                  <span className="font-mono font-bold text-[#137F83]">₹{item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right font-bold text-sm text-[#137F83]">
              Total Payable: ₹{selectedOrderReceipt.grandTotal.toFixed(2)}
            </div>

            <div className="pt-3.5 border-t border-[#DCE4EB] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const xml = ERPIntegrationService.exportToTallyXML(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(xml, `${selectedOrderReceipt.orderNumber}_Tally.xml`, 'application/xml');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#10243A] bg-[#F1F6F8] border border-[#DCE4EB] hover:bg-[#E8EEF4] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Tally Prime XML
                </button>
                <button
                  onClick={() => {
                    const csv = ERPIntegrationService.exportToMargCSV(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(csv, `${selectedOrderReceipt.orderNumber}_Marg.csv`, 'text/csv');
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-[#10243A] bg-[#F1F6F8] border border-[#DCE4EB] hover:bg-[#E8EEF4] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Marg ERP
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl flex items-center gap-1 text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] border border-[#DCE4EB] font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedOrderReceipt(null)}
                  className="px-4 py-1.5 rounded-xl font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
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
