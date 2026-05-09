import React from "react";
import { CreditCard, Plus, ShieldCheck, AlertCircle } from "lucide-react";

const Payments: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Payment Methods
          </h1>
          <p className="text-sm text-zinc-500 font-bold italic">Securely manage your saved cards and payment accounts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-zinc-200 cursor-pointer active:scale-95">
          <Plus size={18} />
          Add Payment Method
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight">PCI DSS Compliant</h3>
          <p className="text-xs text-blue-700/70 font-bold mt-1 leading-relaxed">
            Your payment details are encrypted and stored securely. PrintifyX never stores your full card number on our servers.
          </p>
        </div>
      </div>

      {/* Empty State / List */}
      <div className="bg-white rounded-[2.5rem] p-16 flex flex-col items-center text-center border border-zinc-200 shadow-sm">
        <div className="h-24 w-24 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-200 mb-8 shadow-inner">
          <CreditCard size={48} strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">
          No saved cards
        </h3>
        <p className="text-zinc-500 font-bold max-w-sm mb-10 text-base leading-relaxed">
          You haven't added any payment methods yet. Add a card to enjoy faster checkouts on your future orders.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col items-center gap-2">
            <div className="w-12 h-8 bg-zinc-200 rounded-md"></div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Credit/Debit Card</p>
          </div>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex flex-col items-center gap-2 opacity-50">
            <div className="w-12 h-8 bg-zinc-200 rounded-md"></div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">UPI / Net Banking</p>
          </div>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="flex items-center gap-3 px-6 py-4 bg-zinc-50 rounded-2xl border border-zinc-100">
        <AlertCircle size={16} className="text-zinc-400" />
        <p className="text-[11px] text-zinc-500 font-bold">
          Need help with payments? <button className="text-zinc-900 underline hover:no-underline ml-1">Contact Support</button>
        </p>
      </div>
    </div>
  );
};

export default Payments;
