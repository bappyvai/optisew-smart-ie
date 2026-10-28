import React, { useState, useMemo } from 'react';
import { useIE } from '../context/IEContext';
import { Operator, Machine, SkillGrade } from '../types';
import { X, QrCode, Search, Check, AlertCircle, UserCheck, Wrench } from 'lucide-react';

interface OperatorMachineSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'operator' | 'machine';
  layoutId: string;
  workstationId: string;
  currentEntityId?: string; // current operator employeeId or machineId
  workstationName: string;
}

export const OperatorMachineSwapModal: React.FC<OperatorMachineSwapModalProps> = ({
  isOpen,
  onClose,
  type,
  layoutId,
  workstationId,
  currentEntityId,
  workstationName,
}) => {
  const {
    operators,
    machines,
    swapWorkstationOperator,
    swapWorkstationMachine,
    getOperatorByEmployeeId,
    getMachineByMachineId,
  } = useIE();

  const [activeTab, setActiveTab] = useState<'scan' | 'search'>('scan');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPresentOnly, setFilterPresentOnly] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [scannedCode, setScannedCode] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  // Pre-filter operators
  const filteredOperators = useMemo(() => {
    if (type !== 'operator') return [];
    return operators
      .filter((op) => {
        if (filterPresentOnly && !op.isPresent) return false;
        if (selectedGrade !== 'all' && op.skillGrade !== selectedGrade) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          op.name.toLowerCase().includes(q) ||
          op.employeeId.toLowerCase().includes(q) ||
          op.designation.toLowerCase().includes(q)
        );
      })
      .slice(0, 30); // smooth responsive display of 1000 items
  }, [operators, type, filterPresentOnly, selectedGrade, searchQuery]);

  // Pre-filter machines
  const filteredMachines = useMemo(() => {
    if (type !== 'machine') return [];
    return machines
      .filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          m.machineId.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        );
      })
      .slice(0, 30);
  }, [machines, type, searchQuery]);

  if (!isOpen) return null;

  const currentOp = type === 'operator' && currentEntityId ? getOperatorByEmployeeId(currentEntityId) : undefined;
  const currentMach = type === 'machine' && currentEntityId ? getMachineByMachineId(currentEntityId) : undefined;

  const handleSelectOperator = (op: Operator) => {
    swapWorkstationOperator(layoutId, workstationId, currentEntityId || null, op.employeeId);
    onClose();
  };

  const handleSelectMachine = (m: Machine) => {
    swapWorkstationMachine(layoutId, workstationId, currentEntityId || null, m.machineId);
    onClose();
  };

  const handleSimulateScan = (codeToScan?: string) => {
    setIsScanningSimulated(true);
    setScanMessage(null);

    setTimeout(() => {
      setIsScanningSimulated(false);
      const code = codeToScan || scannedCode.trim();

      if (type === 'operator') {
        // extract e.g. OPR-1045 from QR-OPR-1045 or raw OPR-1045
        const cleanedId = code.replace('QR-', '').trim().toUpperCase();
        const found = operators.find((o) => o.employeeId === cleanedId || o.qrCode === code);
        if (found) {
          setScanMessage({ text: `Matched: ${found.name} (${found.employeeId}) - Grade ${found.skillGrade}`, success: true });
          swapWorkstationOperator(layoutId, workstationId, currentEntityId || null, found.employeeId);
          setTimeout(() => onClose(), 900);
        } else {
          setScanMessage({ text: `No operator found matching barcode "${code}"`, success: false });
        }
      } else {
        const cleanedId = code.replace('QR-', '').trim().toUpperCase();
        const found = machines.find((m) => m.machineId === cleanedId || m.qrCode === code);
        if (found) {
          setScanMessage({ text: `Matched: ${found.machineId} (${found.brand} ${found.model})`, success: true });
          swapWorkstationMachine(layoutId, workstationId, currentEntityId || null, found.machineId);
          setTimeout(() => onClose(), 900);
        } else {
          setScanMessage({ text: `No machine found matching barcode "${code}"`, success: false });
        }
      }
    }, 600);
  };

  // Sample quick scan badges for quick 1-click test in demo
  const sampleQuickScanBadges = type === 'operator'
    ? [
        { label: 'OPR-1025 (Grade A)', code: 'QR-OPR-1025' },
        { label: 'OPR-1082 (Grade A)', code: 'QR-OPR-1082' },
        { label: 'OPR-1140 (Grade B)', code: 'QR-OPR-1140' },
        { label: 'OPR-1205 (Grade B)', code: 'QR-OPR-1205' },
      ]
    : [
        { label: 'MCH-0015 (Juki SNLS)', code: 'QR-MCH-0015' },
        { label: 'MCH-0042 (Brother Lock)', code: 'QR-MCH-0042' },
        { label: 'MCH-0105 (Pegasus 4T)', code: 'QR-MCH-0105' },
        { label: 'MCH-0210 (Yamato Flat)', code: 'QR-MCH-0210' },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900">
                {type === 'operator' ? 'Change Operator (Absentee / Swap)' : 'Swap Machine (Maintenance / Backup)'}
              </span>
              <span className="text-xs font-mono text-slate-500">· {workstationName}</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {type === 'operator'
                ? 'Scan employee ID card QR or select an active substitute from HRIS (1,000 operators).'
                : 'Scan machine QR barcode or select from machine inventory (2,000 machines).'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Currently Assigned:</span>
            {type === 'operator' ? (
              currentOp ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{currentOp.name}</span>
                  <span className="font-mono text-slate-500">({currentOp.employeeId})</span>
                  <span
                    className={`font-medium ${
                      currentOp.isPresent ? 'text-emerald-700' : 'text-rose-600 font-semibold'
                    }`}
                  >
                    {currentOp.isPresent ? 'Present' : 'Absent today'}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">None assigned</span>
              )
            ) : currentMach ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{currentMach.machineId}</span>
                <span className="text-slate-500">
                  {currentMach.brand} {currentMach.model}
                </span>
                <span className="text-slate-500 font-mono">[{currentMach.status}]</span>
              </div>
            ) : (
              <span className="text-slate-400 italic">None assigned</span>
            )}
          </div>
        </div>

        {/* Mode Switch: QR Scan vs Search */}
        <div className="flex border-b border-slate-200 px-6 pt-3">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 border-b-2 px-4 pb-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'scan'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="h-4 w-4" />
            Scan ID / Barcode
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 border-b-2 px-4 pb-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'search'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="h-4 w-4" />
            Browse & Search System ({type === 'operator' ? '1,000 HRIS' : '2,000 Machine Inventory'})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'scan' ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <QrCode className={`h-8 w-8 text-slate-700 ${isScanningSimulated ? 'animate-pulse text-blue-600' : ''}`} />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                  {type === 'operator' ? 'Optical Scanner Ready' : 'Machine Barcode Scanner Ready'}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Aim handheld terminal or type employee ID badge / machine tag below
                </p>

                {/* Barcode Input */}
                <div className="mt-4 flex max-w-md mx-auto items-center gap-2">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSimulateScan();
                    }}
                    placeholder={type === 'operator' ? 'e.g. OPR-1025 or QR-OPR-1025' : 'e.g. MCH-0015'}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono focus:border-slate-900 focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleSimulateScan()}
                    disabled={isScanningSimulated || !scannedCode.trim()}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {isScanningSimulated ? 'Scanning...' : 'Trigger Scan'}
                  </button>
                </div>

                {scanMessage && (
                  <div
                    className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
                      scanMessage.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {scanMessage.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{scanMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Quick Test Barcode Buttons */}
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Simulated Scan Samples (1-Click Test):</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQuickScanBadges.map((sample) => (
                    <button
                      key={sample.code}
                      onClick={() => {
                        setScannedCode(sample.code);
                        handleSimulateScan(sample.code);
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      Scan {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      type === 'operator'
                        ? 'Search 1,000 operators by Name or ID...'
                        : 'Search 2,000 machines by ID, Brand, Model...'
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs focus:border-slate-900 focus:outline-hidden"
                  />
                </div>

                {type === 'operator' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterPresentOnly(!filterPresentOnly)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        filterPresentOnly
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {filterPresentOnly ? 'Present Only' : 'All Staff'}
                    </button>

                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 focus:outline-hidden"
                    >
                      <option value="all">All Grades</option>
                      <option value="A">Grade A (90%+)</option>
                      <option value="B">Grade B (75-89%)</option>
                      <option value="C">Grade C (60-74%)</option>
                      <option value="D">Grade D (&lt;60%)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg max-h-72 overflow-y-auto">
                {type === 'operator' ? (
                  filteredOperators.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">No matching operators found</div>
                  ) : (
                    filteredOperators.map((op) => (
                      <div
                        key={op.id}
                        className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-semibold text-slate-700">
                            {op.skillGrade}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-900">{op.name}</span>
                              <span className="font-mono text-xs text-slate-500">{op.employeeId}</span>
                              <span
                                className={`text-[10px] font-medium ${
                                  op.isPresent ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {op.isPresent ? 'Present' : 'Absent'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span>{op.designation}</span>
                              <span className="mx-1.5">·</span>
                              <span className="tabular-nums font-mono">{op.efficiencyAvg}% avg eff</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectOperator(op)}
                          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    ))
                  )
                ) : filteredMachines.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">No matching machines found</div>
                ) : (
                  filteredMachines.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{m.machineId}</span>
                          <span className="text-xs font-medium text-slate-700">
                            {m.brand} {m.model}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span>{m.category}</span>
                          <span className="mx-1.5">·</span>
                          <span>{m.floorLine}</span>
                          <span className="mx-1.5">·</span>
                          <span
                            className={
                              m.status === 'Operational'
                                ? 'text-emerald-700 font-medium'
                                : m.status === 'In-Maintenance'
                                ? 'text-amber-700 font-medium'
                                : 'text-slate-500'
                            }
                          >
                            {m.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectMachine(m)}
                        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
