import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { X, Copy, Check, ArrowRight } from 'lucide-react';

interface CopyLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStyleId?: string;
}

export const CopyLayoutModal: React.FC<CopyLayoutModalProps> = ({
  isOpen,
  onClose,
  targetStyleId,
}) => {
  const { lineLayouts, styles, copyLineLayout } = useIE();

  const [selectedSourceLayoutId, setSelectedSourceLayoutId] = useState<string>(
    lineLayouts[0]?.id || ''
  );
  const [selectedTargetStyleId, setSelectedTargetStyleId] = useState<string>(
    targetStyleId || styles[0]?.id || ''
  );
  const [newLayoutName, setNewLayoutName] = useState<string>('');

  if (!isOpen) return null;

  const sourceLayout = lineLayouts.find((l) => l.id === selectedSourceLayoutId);
  const targetStyle = styles.find((s) => s.id === selectedTargetStyleId);

  const handleCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSourceLayoutId || !selectedTargetStyleId) return;

    const name =
      newLayoutName.trim() ||
      `Layout for ${targetStyle?.styleCode || 'New Style'} (from ${sourceLayout?.layoutName || 'Source'})`;

    copyLineLayout(selectedSourceLayoutId, selectedTargetStyleId, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-slate-700" />
            <h3 className="text-base font-semibold text-slate-900">Copy Line Layout</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleCopy} className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Duplicate an existing high-efficiency line layout to another style. All workstation sequences,
            operator assignments, and machine configurations will be cloned so you only make slight adjustments.
          </p>

          {/* Select Source Layout */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Source Line Layout to Clone From
            </label>
            <select
              value={selectedSourceLayoutId}
              onChange={(e) => {
                setSelectedSourceLayoutId(e.target.value);
                const src = lineLayouts.find((l) => l.id === e.target.value);
                if (src && targetStyle) {
                  setNewLayoutName(`Line Layout - ${targetStyle.styleCode} (Cloned)`);
                }
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-hidden"
              required
            >
              {lineLayouts.map((layout) => (
                <option key={layout.id} value={layout.id}>
                  {layout.layoutName} · Style: {layout.styleCode} ({layout.workstations.length} workstations)
                </option>
              ))}
            </select>
          </div>

          {/* Source Layout Preview Card */}
          {sourceLayout && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Source Customer & Style:</span>
                <span className="font-semibold text-slate-900">
                  {sourceLayout.customer} · {sourceLayout.styleName}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Workstations / Operators:</span>
                <span className="font-mono text-slate-900">
                  {sourceLayout.workstations.length} WS / {sourceLayout.totalOperators} Operators
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pitch Time / Line Efficiency:</span>
                <span className="font-mono text-slate-900">
                  {sourceLayout.pitchTime} min · {sourceLayout.balancingEfficiency}%
                </span>
              </div>
            </div>
          )}

          {/* Arrow divider */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-1">
            <span className="h-px w-16 bg-slate-200" />
            <ArrowRight className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-600">Clone into Target Style</span>
            <span className="h-px w-16 bg-slate-200" />
          </div>

          {/* Select Target Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Garment Style
            </label>
            <select
              value={selectedTargetStyleId}
              onChange={(e) => {
                setSelectedTargetStyleId(e.target.value);
                const sty = styles.find((s) => s.id === e.target.value);
                if (sty) {
                  setNewLayoutName(`Line Layout - ${sty.styleCode} (Cloned)`);
                }
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-slate-900 focus:outline-hidden"
              required
            >
              {styles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.styleCode} — {style.styleName} ({style.customer}) · Total SMV: {style.totalSmv} min
                </option>
              ))}
            </select>
          </div>

          {/* New Layout Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Layout Title
            </label>
            <input
              type="text"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="e.g. Line 03 - Polo Shirt Fast Track Layout"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Confirm & Duplicate Layout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
