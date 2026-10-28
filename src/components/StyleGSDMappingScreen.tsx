import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { Style, GSDOperation } from '../types';
import {
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  GitBranch,
  X,
  Shirt,
  Layers,
} from 'lucide-react';

export const StyleGSDMappingScreen: React.FC = () => {
  const {
    styles,
    selectedStyleId,
    setSelectedStyleId,
    gsdOperations,
    addOperationToStyle,
    removeOperationFromStyle,
    reorderStyleOperations,
    createLineLayout,
    setCurrentScreen,
    lineLayouts,
    setSelectedLayoutId,
  } = useIE();

  const [searchStyleQuery, setSearchStyleQuery] = useState('');
  const [isAddOpModalOpen, setIsAddOpModalOpen] = useState(false);
  const [opSearchQuery, setOpSearchQuery] = useState('');

  const selectedStyle = styles.find((s) => s.id === selectedStyleId) || styles[0];

  const filteredStyles = styles.filter((s) => {
    if (!searchStyleQuery.trim()) return true;
    const q = searchStyleQuery.toLowerCase();
    return (
      s.styleCode.toLowerCase().includes(q) ||
      s.styleName.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q)
    );
  });

  const handleQuickAddOperation = (gsdId: string) => {
    if (!selectedStyle) return;
    addOperationToStyle(selectedStyle.id, gsdId);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !selectedStyle) return;
    reorderStyleOperations(selectedStyle.id, index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (!selectedStyle || index === selectedStyle.gsdOperations.length - 1) return;
    reorderStyleOperations(selectedStyle.id, index, index + 1);
  };

  const handleBuildLayoutForStyle = () => {
    if (!selectedStyle) return;
    const existing = lineLayouts.find((l) => l.styleId === selectedStyle.id);
    if (existing) {
      setSelectedLayoutId(existing.id);
      setCurrentScreen('line-layout');
      return;
    }
    const newLayout = createLineLayout(
      selectedStyle.id,
      `Line 01 - ${selectedStyle.styleCode} Balanced Layout`,
      'Sewing Line 01'
    );
    setSelectedLayoutId(newLayout.id);
    setCurrentScreen('line-layout');
  };

  const availableGSD = gsdOperations.filter((g) => {
    if (!opSearchQuery.trim()) return true;
    const q = opSearchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.motherOperationName.toLowerCase().includes(q) ||
      g.machineCategory.toLowerCase().includes(q)
    );
  });

  const totalSmv = selectedStyle?.totalSmv || 0;
  const opCount = selectedStyle?.gsdOperations.length || 0;
  const estimatedPitch = opCount > 0 ? Number((totalSmv / opCount).toFixed(2)) : 0;
  const recommendedOperators =
    selectedStyle?.targetHourlyOutput && totalSmv > 0
      ? Math.ceil((selectedStyle.targetHourlyOutput * totalSmv) / 60)
      : opCount || 10;
  const dailyOutput8Hrs = selectedStyle ? selectedStyle.targetHourlyOutput * 8 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Style GSD Operation Mapping</h1>
            <span className="text-xs font-mono text-slate-500">· Summation of Operations SMV</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Select a style from the Style Master to map sequential GSD operations.
            Total Style SMV is automatically calculated by summing all selected operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('style-master')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Shirt className="h-4 w-4" />
            <span>Manage Style Master</span>
          </button>

          <button
            onClick={handleBuildLayoutForStyle}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>Generate Line Layout</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Styles Selector + Mapping Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Style Selector (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Shirt className="h-4 w-4 text-slate-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Choose Style to Map</h2>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">{styles.length} styles</span>
          </div>

          {/* Search Style */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchStyleQuery}
              onChange={(e) => setSearchStyleQuery(e.target.value)}
              placeholder="Search by style code, buyer..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Style list */}
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredStyles.map((style) => {
              const isSelected = style.id === selectedStyle?.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{style.styleCode}</span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {style.customer}
                    </span>
                  </div>

                  <div className={`mt-1 text-xs truncate ${isSelected ? 'text-slate-200' : 'text-slate-700'}`}>
                    {style.styleName}
                  </div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[11px] font-mono tabular-nums ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    <span>Total SMV: {style.totalSmv.toFixed(2)} min</span>
                    <span>{style.gsdOperations.length} ops</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Style Detail & GSD Operations Sequence (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedStyle ? (
            <>
              {/* Style Banner & IE Summary Strip */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{selectedStyle.styleCode}</span>
                      <span className="text-xs font-medium text-slate-500">· {selectedStyle.styleName}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Buyer: <strong className="text-slate-800">{selectedStyle.customer}</strong> · Season:{' '}
                      <span className="font-mono">{selectedStyle.season}</span> · Order Qty:{' '}
                      <span className="font-mono tabular-nums">{selectedStyle.orderQty.toLocaleString()} pcs</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddOpModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Attach GSD Operation</span>
                  </button>
                </div>

                {/* 4-Column IE Metric Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500">Total Style SMV</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                      {totalSmv.toFixed(2)} <span className="text-xs font-normal text-slate-500">min</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Sum of {opCount} operations</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-slate-500">Target Output / Hr</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                      {selectedStyle.targetHourlyOutput}{' '}
                      <span className="text-xs font-normal text-slate-500">pcs/hr</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{dailyOutput8Hrs.toLocaleString()} pcs / 8-hr shift</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-slate-500">Avg Pitch Time</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                      {estimatedPitch}{' '}
                      <span className="text-xs font-normal text-slate-500">min/pc</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Based on {opCount} stages</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium text-slate-500">Line Operators Reqd</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                      {recommendedOperators}{' '}
                      <span className="text-xs font-normal text-slate-500">manpower</span>
                    </div>
                    <div className="text-[10px] text-slate-400">At 100% target pacing</div>
                  </div>
                </div>
              </div>

              {/* Mapped Operations Table */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Style Operation Sequence
                    </span>
                    <span className="text-xs font-mono text-slate-500">({selectedStyle.gsdOperations.length})</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Use arrows to adjust manufacturing flow sequence
                  </span>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3 text-center w-12">Seq</th>
                      <th className="py-2.5 px-3">Operation Name</th>
                      <th className="py-2.5 px-3">Mother Operation</th>
                      <th className="py-2.5 px-3">Machine Category</th>
                      <th className="py-2.5 px-3 text-right">SMV</th>
                      <th className="py-2.5 px-3 text-right">Reorder</th>
                      <th className="py-2.5 px-3 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {selectedStyle.gsdOperations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No operations mapped to this style yet. Click "Attach GSD Operation" above.
                        </td>
                      </tr>
                    ) : (
                      selectedStyle.gsdOperations.map((mapping, idx) => (
                        <tr key={mapping.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                            {mapping.sequence}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{mapping.operationName}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <span className="inline-block text-slate-800">{mapping.motherOperationName}</span>
                            <span className="ml-1 text-[10px] text-slate-400">({mapping.category})</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{mapping.machineCategory}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                            {mapping.smv.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleMoveUp(idx)}
                                disabled={idx === 0}
                                className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Move up"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleMoveDown(idx)}
                                disabled={idx === selectedStyle.gsdOperations.length - 1}
                                className="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Move down"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => removeOperationFromStyle(selectedStyle.id, mapping.id)}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Remove from style"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {selectedStyle.gsdOperations.length > 0 && (
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-xs">
                        <td colSpan={4} className="py-3 px-3 text-right text-slate-700">
                          Total Style SMV (Summation of All Operations):
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-sm font-bold text-slate-950">
                          {totalSmv.toFixed(2)} min
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a style to view details.</div>
          )}
        </div>
      </div>

      {/* Attach GSD Operation Modal */}
      {isAddOpModalOpen && selectedStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Attach GSD Operations to {selectedStyle.styleCode}
                </h3>
                <p className="text-xs text-slate-500">
                  Select standard sewing operations from the GSD catalog to include in this garment style
                </p>
              </div>
              <button
                onClick={() => setIsAddOpModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={opSearchQuery}
                  onChange={(e) => setOpSearchQuery(e.target.value)}
                  placeholder="Search GSD catalog by name, code, machine, mother op..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs focus:border-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {availableGSD.map((op) => {
                const alreadyMapped = selectedStyle.gsdOperations.some((m) => m.operationId === op.id);
                return (
                  <div
                    key={op.id}
                    className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{op.code}</span>
                        <span className="text-xs font-semibold text-slate-900">{op.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {op.machineCategory}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Mother Op: {op.motherOperationName} · Category: {op.category} · Standard SMV:{' '}
                        <strong className="font-mono text-slate-800">{op.smv.toFixed(2)} min</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAddOperation(op.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        alreadyMapped
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <Plus className="h-3 w-3" />
                      <span>{alreadyMapped ? 'Add Again' : 'Add to Style'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button
                onClick={() => setIsAddOpModalOpen(false)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
