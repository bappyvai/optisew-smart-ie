import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { OperationCategory, MotherOperation } from '../types';
import { Plus, Search, Edit2, Trash2, X, Check, Layers, AlertCircle } from 'lucide-react';

export const MotherOperationMaster: React.FC = () => {
  const { motherOperations, addMotherOperation, updateMotherOperation, deleteMotherOperation, gsdOperations } =
    useIE();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | OperationCategory>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<MotherOperation | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<OperationCategory>('Intermediate');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fixed categories as requested: Basic, Intermediate, Advance
  const CATEGORIES: OperationCategory[] = ['Basic', 'Intermediate', 'Advance'];

  const filteredList = motherOperations.filter((op) => {
    if (categoryFilter !== 'All' && op.category !== categoryFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return op.name.toLowerCase().includes(q) || op.description.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingOp(null);
    setName('');
    setCategory('Basic');
    setDescription('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (op: MotherOperation) => {
    setEditingOp(op);
    setName(op.name);
    setCategory(op.category);
    setDescription(op.description || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Mother Operation name is required');
      return;
    }

    if (editingOp) {
      updateMotherOperation(editingOp.id, name, category, description);
    } else {
      addMotherOperation(name, category, description);
    }
    setIsModalOpen(false);
  };

  // Helper count of linked GSD ops
  const getGsdCount = (mopId: string) => {
    return gsdOperations.filter((g) => g.motherOperationId === mopId).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Mother Operation Master</h1>
            <span className="text-xs font-mono text-slate-500">· Standard Garment Macro Operations</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Configure primary manufacturing operation groups classified by technical difficulty. Category is restricted to
            fixed classifications: Basic, Intermediate, and Advance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Mother Operation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Basic', 'Intermediate', 'Advance'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat} {cat === 'All' ? `(${motherOperations.length})` : `(${motherOperations.filter((o) => o.category === cat).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mother operations..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Mother Operations Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Mother Operation Name</th>
              <th className="py-3 px-4">Operation Category (Fixed)</th>
              <th className="py-3 px-4">Description / Key Motions</th>
              <th className="py-3 px-4 text-center">Linked GSD Ops</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No mother operations found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredList.map((op, idx) => {
                const gsdCount = getGsdCount(op.id);
                return (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {op.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          op.category === 'Advance'
                            ? 'text-indigo-700'
                            : op.category === 'Intermediate'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {op.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                      {op.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                      {gsdCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(op)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMotherOperation(op.id)}
                          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {editingOp ? 'Edit Mother Operation' : 'Add New Mother Operation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mother Operation Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mother Operation Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Collar Preparation, Sleeve Attach, Waistband Attach"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  autoFocus
                  required
                />
              </div>

              {/* Operation Category (Fixed Dropdown: Basic, Intermediate, Advance) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operation Category (Fixed Dropdown) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OperationCategory)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  Determines required skill matrix tier and operator qualification grade.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Description / Elements
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Standard stitch motions, folding tolerances, interlining insert"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
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
                  {editingOp ? 'Update Mother Operation' : 'Save Mother Operation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
