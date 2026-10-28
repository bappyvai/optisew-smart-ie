import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { Style } from '../types';
import { Plus, Search, Edit2, Trash2, X, Shirt, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export const StyleMasterScreen: React.FC = () => {
  const { styles, addStyle, updateStyle, deleteStyle, setSelectedStyleId, setCurrentScreen } = useIE();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);

  // Form State
  const [styleCode, setStyleCode] = useState('');
  const [styleName, setStyleName] = useState('');
  const [customer, setCustomer] = useState('Ralph Lauren');
  const [garmentType, setGarmentType] = useState('Polo Shirt');
  const [season, setSeason] = useState('SS 2026');
  const [orderQty, setOrderQty] = useState<number>(25000);
  const [targetHourlyOutput, setTargetHourlyOutput] = useState<number>(120);

  const filteredStyles = styles.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.styleCode.toLowerCase().includes(q) ||
      s.styleName.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q) ||
      s.garmentType.toLowerCase().includes(q) ||
      s.season.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingStyle(null);
    setStyleCode('');
    setStyleName('');
    setCustomer('Ralph Lauren');
    setGarmentType('Polo Shirt');
    setSeason('SS 2026');
    setOrderQty(25000);
    setTargetHourlyOutput(120);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (style: Style) => {
    setEditingStyle(style);
    setStyleCode(style.styleCode);
    setStyleName(style.styleName);
    setCustomer(style.customer);
    setGarmentType(style.garmentType);
    setSeason(style.season);
    setOrderQty(style.orderQty);
    setTargetHourlyOutput(style.targetHourlyOutput);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!styleCode.trim() || !styleName.trim()) return;

    if (editingStyle) {
      updateStyle(editingStyle.id, {
        styleCode: styleCode.trim().toUpperCase(),
        styleName: styleName.trim(),
        customer,
        garmentType,
        season,
        orderQty,
        targetHourlyOutput,
      });
    } else {
      addStyle({
        styleCode: styleCode.trim().toUpperCase(),
        styleName: styleName.trim(),
        customer,
        garmentType,
        season,
        orderQty,
        targetHourlyOutput,
      });
    }
    setIsModalOpen(false);
  };

  const handleOpenMappingForStyle = (styleId: string) => {
    setSelectedStyleId(styleId);
    setCurrentScreen('style-mapping');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Garment Style Master</h1>
            <span className="text-xs font-mono text-slate-500">· Apparel Product Database & Style Creation</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Central repository for creating and managing garment buyer styles, target hourly output, order quantities,
            and seasons. Operation SMV mapping is managed on the dedicated Style GSD Mapping screen.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Style Creation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Total Registered Styles:</span>
          <strong className="text-slate-900 font-mono tabular-nums">{styles.length} styles</strong>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles by code, buyer, item, season..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Styles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStyles.map((style) => (
          <div
            key={style.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {style.styleCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">{style.styleName}</h3>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  {style.customer}
                </span>
              </div>

              {/* Specs */}
              <div className="py-3 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Garment Item / Type:</span>
                  <span className="font-semibold text-slate-900">{style.garmentType}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Season:</span>
                  <span className="font-mono text-slate-800">{style.season}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Order Quantity:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {style.orderQty.toLocaleString()} pcs
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Hourly Output (100%):</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {style.targetHourlyOutput} pcs/hr
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Style SMV:</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    {style.totalSmv.toFixed(2)} min ({style.gsdOperations.length} ops)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(style)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  title="Edit Style"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteStyle(style.id)}
                  className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete Style"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleOpenMappingForStyle(style.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors"
              >
                <span>GSD Operation Mapping</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New / Edit Style Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {editingStyle ? 'Edit Garment Style' : 'Create New Garment Style'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Style Code *</label>
                  <input
                    type="text"
                    value={styleCode}
                    onChange={(e) => setStyleCode(e.target.value)}
                    placeholder="e.g. POLO-2026-SP"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Buyer *</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g. Ralph Lauren, Zara, Nike"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Style Title / Description *</label>
                <input
                  type="text"
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  placeholder="e.g. Mens Classic Pique Polo Shirt with Ribbed Collar"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Garment Type</label>
                  <input
                    type="text"
                    value={garmentType}
                    onChange={(e) => setGarmentType(e.target.value)}
                    placeholder="e.g. Polo Shirt, Denim Jeans, Blouse"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Season</label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="e.g. SS 2026, AW 2026"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Order Quantity (Pcs)</label>
                  <input
                    type="number"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Output / Hr (100%)</label>
                  <input
                    type="number"
                    value={targetHourlyOutput}
                    onChange={(e) => setTargetHourlyOutput(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  {editingStyle ? 'Update Style' : 'Create Style'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
