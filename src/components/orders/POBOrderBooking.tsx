import React, { useState } from 'react';
import { POBOrder, POBOrderItem, Product, Chemist, Stockist, User } from '../../types';
import { Badge } from '../common/Badge';
import { ShoppingCart, Plus, CheckCircle2, FileText, Printer, Building2, Store, X, Download } from 'lucide-react';
import { ERPIntegrationService } from '../../services/erpIntegrationService';

interface POBOrderBookingProps {
  products: Product[];
  chemists: Chemist[];
  currentUser: User;
}

export const POBOrderBooking: React.FC<POBOrderBookingProps> = ({
  products,
  chemists,
  currentUser,
}) => {
  const [orders, setOrders] = useState<POBOrder[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChemistId, setSelectedChemistId] = useState(chemists[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [orderQty, setOrderQty] = useState(10);
  const [freeQty, setFreeQty] = useState(1);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<POBOrder | null>(null);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const chem = chemists.find(c => c.id === selectedChemistId) || chemists[0];
    const prod = products.find(p => p.id === selectedProductId) || products[0];

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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-600" />
            Product Order Booking (POB) Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Book secondary sales orders with chemist bonus schemes, calculate PTR taxes, and generate invoices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Book New Order
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No POB Orders Booked Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Book New Order" to record product orders booked directly at chemist counters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{ord.buyerName}</h3>
                    <Badge variant="primary">{ord.orderNumber}</Badge>
                    <Badge variant="success">{ord.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Booked by: <strong>{ord.userName}</strong> • Order Date: {ord.orderDate} • Delivery Target: {ord.expectedDeliveryDate}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => setSelectedOrderReceipt(ord)}
                    className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Receipt
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">Product SKU</th>
                      <th className="p-2.5">Pack</th>
                      <th className="p-2.5">Qty</th>
                      <th className="p-2.5">Free Scheme</th>
                      <th className="p-2.5">Rate (PTR)</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ord.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-semibold text-slate-800">{item.productName}</td>
                        <td className="p-2.5 text-slate-500">{item.packSize}</td>
                        <td className="p-2.5 font-mono font-bold">{item.quantity}</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-semibold">+{item.freeQuantity} Free</td>
                        <td className="p-2.5 font-mono">₹{item.rate.toFixed(2)}</td>
                        <td className="p-2.5 font-mono font-bold text-right">₹{item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-6 text-xs">
                <div>
                  <span className="text-slate-400">Subtotal:</span>{' '}
                  <span className="font-mono font-semibold">₹{ord.subTotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400">GST (12%):</span>{' '}
                  <span className="font-mono font-semibold">₹{ord.gstAmount.toFixed(2)}</span>
                </div>
                <div className="bg-teal-50 px-3 py-1 rounded-lg border border-teal-100 font-bold text-teal-900 text-sm">
                  Grand Total: ₹{ord.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-teal-600" />
                Book Secondary Sales Order (POB)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Chemist Outlet</label>
                <select
                  value={selectedChemistId}
                  onChange={(e) => setSelectedChemistId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                >
                  {chemists.map(c => (
                    <option key={c.id} value={c.id}>{c.shopName} ({c.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brandName || p.name} (PTR: ₹{p.ptr?.toFixed(2) || '135.00'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Order Quantity (Boxes/Strips)</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Free Scheme Bonus Units</label>
                  <input
                    type="number"
                    min="0"
                    value={freeQty}
                    onChange={(e) => setFreeQty(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600">Order Booking Receipt</span>
                <h3 className="font-bold text-base text-slate-900">{selectedOrderReceipt.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrderReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1">
              <p><strong>Billed To:</strong> {selectedOrderReceipt.buyerName}</p>
              <p><strong>Booking Rep:</strong> {selectedOrderReceipt.userName}</p>
              <p><strong>Territory:</strong> {selectedOrderReceipt.territoryName}</p>
              <p><strong>Order Date:</strong> {selectedOrderReceipt.orderDate}</p>
            </div>

            <div className="space-y-1">
              {selectedOrderReceipt.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                  <span>{item.productName} ({item.quantity} + {item.freeQuantity} Free)</span>
                  <span className="font-mono font-bold">₹{item.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right font-bold text-sm text-teal-800">
              Total Payable: ₹{selectedOrderReceipt.grandTotal.toFixed(2)}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const xml = ERPIntegrationService.exportToTallyXML(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(xml, `${selectedOrderReceipt.orderNumber}_Tally.xml`, 'application/xml');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Tally Prime XML
                </button>
                <button
                  onClick={() => {
                    const csv = ERPIntegrationService.exportToMargCSV(selectedOrderReceipt);
                    ERPIntegrationService.downloadFile(csv, `${selectedOrderReceipt.orderNumber}_Marg.csv`, 'text/csv');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Marg ERP
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 text-slate-700 font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedOrderReceipt(null)}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-semibold"
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
