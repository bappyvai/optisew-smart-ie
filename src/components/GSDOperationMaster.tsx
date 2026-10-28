import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { GSDOperation, MachineCategory, OperationCategory } from '../types';
import { Plus, Search, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export const GSDOperationMaster: React.FC = () => {
  const { gsdOperations, motherOperations, addGSDOperation, updateGSDOperation, deleteGSDOperation } = useIE();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMotherOpFilter, setSelectedMotherOpFilter] = useState('All');
  const [selectedMachineFilter, setSelectedMachineFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<GSDOperation | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [motherOpId, setMotherOpId] = useState(motherOperations[0]?.id || '');
  const [smv, setSmv] = useState<number>(0.45);
  const [machineCategory, setMachineCategory] = useState<MachineCategory>('SNLS');
  const [errorMsg, setErrorMsg] = useState('');

  const MACHINE_CATEGORIES: MachineCategory[] = [
    'SNLS',
    'DNLS',
    'Overlock 3T',
    'Overlock 4T',
    'Overlock 5T',
    'Flatlock Cylinder',
    'Flatlock Flatbed',
    'Kansai Multi-Needle',
    'Button Hole (Auto)',
    'Button Attach',
    'Bartack',
    'Feed Off The Arm (FOA)',
    'Ironing / Press',
    'Manual / Trimming',
  ];

  const filteredGSD = gsdOperations.filter((op) => {
    if (selectedMotherOpFilter !== 'All' && op.motherOperationId !== selectedMotherOpFilter) return false;
    if (selectedMachineFilter !== 'All' && op.machineCategory !== selectedMachineFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      op.name.toLowerCase().includes(q) ||
      op.code.toLowerCase().includes(q) ||
      op.motherOperationName.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingOp(null);
    setName('');
    setMotherOpId(motherOperations[0]?.id || '');
    setSmv(0.45);
    setMachineCategory('SNLS');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (op: GSDOperation) => {
    setEditingOp(op);
    setName(op.name);
    setMotherOpId(op.motherOperationId);
    setSmv(op.smv);
    setMachineCategory(op.machineCategory);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Operation Name is required');
      return;
    }
    if (smv <= 0) {
      setErrorMsg('SMV must be greater than 0');
      return;
    }

    const mother = motherOperations.find((m) => m.id === motherOpId);
    if (!mother) {
      setErrorMsg('Please select a valid Mother Operation');
      return;
    }

    if (editingOp) {
      updateGSDOperation(editingOp.id, {
        name: name.trim(),
        motherOperationId: mother.id,
        motherOperationName: mother.name,
        category: mother.category,
        smv: Number(smv),
        machineCategory,
      });
    } else {
      addGSDOperation({
        name: name.trim(),
        motherOperationId: mother.id,
        motherOperationName: mother.name,
        category: mother.category,
        smv: Number(smv),
        machineCategory,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">GSD Operation Master</h1>
            <span className="text-xs font-mono text-slate-500">· General Sewing Data & SMV Standards</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Micro-motion sewing operation catalog mapping Operation Name, Mother Operation, Standard Minute Value (SMV), and Machine Category.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add GSD Operation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mother Operation Filter */}
          <select
            value={selectedMotherOpFilter}
            onChange={(e) => setSelectedMotherOpFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Mother Operations ({gsdOperations.length})</option>
            {motherOperations.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.category})
              </option>
            ))}
          </select>

          {/* Machine Category Filter */}
          <select
            value={selectedMachineFilter}
            onChange={(e) => setSelectedMachineFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Machine Types</option>
            {MACHINE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by operation name or code..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* GSD Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Operation Name</th>
              <th className="py-3 px-4">Mother Operation</th>
              <th className="py-3 px-4">Machine Category</th>
              <th className="py-3 px-4 text-right">Standard SMV</th>
              <th className="py-3 px-4 text-right">Target 100% (Pcs/Hr)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredGSD.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No GSD operations found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredGSD.map((op) => {
                const targetHourly = Math.round(60 / op.smv);
                return (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{op.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{op.name}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span>{op.motherOperationName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({op.category})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-700">{op.machineCategory}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {op.smv.toFixed(2)} min
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {targetHourly} pcs/hr
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
                          onClick={() => deleteGSDOperation(op.id)}
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
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {editingOp ? 'Edit GSD Operation' : 'Add GSD Operation'}
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

              {/* Operation Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operation Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Collar Run Stitch with Interlining"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  autoFocus
                  required
                />
              </div>

              {/* Mother Operation dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mother Operation (Macro Group) *
                </label>
                <select
                  value={motherOpId}
                  onChange={(e) => setMotherOpId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                >
                  {motherOperations.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Standard SMV */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Minute Value (SMV) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    max="10.00"
                    value={smv}
                    onChange={(e) => setSmv(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono tabular-nums text-slate-900 focus:border-slate-900 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Target: {smv > 0 ? Math.round(60 / smv) : 0} pcs/hr @ 100%
                  </span>
                </div>

                {/* Machine Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Machine Category *
                  </label>
                  <select
                    value={machineCategory}
                    onChange={(e) => setMachineCategory(e.target.value as MachineCategory)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
                    required
                  >
                    {MACHINE_CATEGORIES.map((mch) => (
                      <option key={mch} value={mch}>
                        {mch}
                      </option>
                    ))}
                  </select>
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
                  {editingOp ? 'Update GSD Operation' : 'Save GSD Operation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
