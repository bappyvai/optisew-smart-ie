import React, { useState, useMemo } from 'react';
import { useIE } from '../context/IEContext';
import { Workstation, LineLayout } from '../types';
import { OperatorMachineSwapModal } from './OperatorMachineSwapModal';
import { CopyLayoutModal } from './CopyLayoutModal';
import {
  GitBranch,
  Copy,
  Plus,
  Users,
  Cpu,
  ArrowRight,
  QrCode,
  Layers,
  Split,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  ChevronDown,
  Download,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';

export const LineLayoutScreen: React.FC = () => {
  const {
    lineLayouts,
    selectedLayoutId,
    setSelectedLayoutId,
    styles,
    createLineLayout,
    groupOperationsIntoWorkstation,
    splitWorkstation,
    getOperatorByEmployeeId,
    getMachineByMachineId,
    gsdOperations,
    setCurrentScreen,
  } = useIE();

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isNewLayoutModalOpen, setIsNewLayoutModalOpen] = useState(false);

  // Grouping modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [targetGroupWsId, setTargetGroupWsId] = useState<string>('');
  const [selectedOpsToGroup, setSelectedOpsToGroup] = useState<string[]>([]);

  // Swap modal state
  const [swapModalConfig, setSwapModalConfig] = useState<{
    isOpen: boolean;
    type: 'operator' | 'machine';
    workstationId: string;
    currentEntityId?: string;
    workstationName: string;
  }>({
    isOpen: false,
    type: 'operator',
    workstationId: '',
    workstationName: '',
  });

  // New Layout Form
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutStyleId, setNewLayoutStyleId] = useState(styles[0]?.id || '');
  const [newLayoutLineName, setNewLayoutLineName] = useState('Sewing Line 01 (Modular)');

  const currentLayout = lineLayouts.find((l) => l.id === selectedLayoutId) || lineLayouts[0];

  const handleOpenSwapModal = (
    type: 'operator' | 'machine',
    wsId: string,
    currentEntityId: string | undefined,
    wsName: string
  ) => {
    setSwapModalConfig({
      isOpen: true,
      type,
      workstationId: wsId,
      currentEntityId,
      workstationName: wsName,
    });
  };

  const handleCreateNewLayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayoutName.trim() || !newLayoutStyleId) return;
    const l = createLineLayout(newLayoutStyleId, newLayoutName.trim(), newLayoutLineName);
    setSelectedLayoutId(l.id);
    setIsNewLayoutModalOpen(false);
    setNewLayoutName('');
  };

  // Open Group Modal
  const handleOpenGroupModal = (ws: Workstation) => {
    setTargetGroupWsId(ws.id);
    setSelectedOpsToGroup([]);
    setIsGroupModalOpen(true);
  };

  const handleConfirmGrouping = () => {
    if (!currentLayout || !targetGroupWsId || selectedOpsToGroup.length === 0) return;
    groupOperationsIntoWorkstation(currentLayout.id, targetGroupWsId, selectedOpsToGroup);
    setIsGroupModalOpen(false);
  };

  // Find GSD Op helpers
  const getGsdOp = (id: string) => gsdOperations.find((g) => g.id === id);

  // Line balancing calculations
  const totalSmv = currentLayout?.workstations.reduce((sum, ws) => sum + ws.totalSmv, 0) || currentLayout?.totalSmv || 5.0;
  const wsCount = currentLayout?.workstations.length || 1;
  const pitchTime = Number((totalSmv / wsCount).toFixed(2));
  const maxWsSmv = currentLayout ? Math.max(...currentLayout.workstations.map((w) => w.totalSmv)) : pitchTime;
  const balancingEfficiency = maxWsSmv > 0 ? Number(((totalSmv / (wsCount * maxWsSmv)) * 100).toFixed(1)) : 85;

  // Export Line Layout to Excel (CSV format)
  const handleExportExcel = () => {
    if (!currentLayout) return;

    const metadataRows = [
      ['OptiSew Smart IE - Line Layout Engineering Export'],
      ['Exported Date', new Date().toLocaleString()],
      ['Layout Name', `"${currentLayout.layoutName}"`],
      ['Style Code', currentLayout.styleCode],
      ['Style Name', `"${currentLayout.styleName}"`],
      ['Buyer / Customer', `"${currentLayout.customer}"`],
      ['Sewing Line', `"${currentLayout.lineName}"`],
      ['Total Style SMV (min)', totalSmv.toFixed(2)],
      ['Line Pitch Time (min)', pitchTime],
      ['Balancing Efficiency %', `${balancingEfficiency}%`],
      ['Target Output (100% Pcs/Hr)', Math.round(60 / pitchTime)],
      ['Total Workstations', currentLayout.workstations.length],
      ['Total Operators Mapped', currentLayout.totalOperators],
      ['Total Machines Mapped', currentLayout.totalMachines],
      [], // blank line
    ];

    const tableHeaders = [
      'Workstation #',
      'Workstation Name',
      'Grouped Operation(s)',
      'Machine Category',
      'Operator Employee ID',
      'Operator Name',
      'Operator Skill Grade',
      'Attendance Today',
      'Machine ID',
      'Machine Model',
      'Machine Status',
      'Workstation SMV (min)',
      'Target Hourly (Pcs/Hr)',
      'Pitch Balancing Status',
    ];

    const dataRows = currentLayout.workstations.map((ws) => {
      const primaryOp = ws.operatorIds[0] ? getOperatorByEmployeeId(ws.operatorIds[0]) : null;
      const primaryMach = ws.machineIds[0] ? getMachineByMachineId(ws.machineIds[0]) : null;
      const opNames = ws.operationIds.map((id) => getGsdOp(id)?.name || id).join(' + ');
      const machCats = Array.from(new Set(ws.operationIds.map((id) => getGsdOp(id)?.machineCategory || 'SNLS'))).join(', ');
      const isBottleneck = ws.totalSmv > pitchTime * 1.15;
      const isStarved = ws.totalSmv < pitchTime * 0.7;
      const balanceStatus = isBottleneck ? 'Bottleneck (> Pitch)' : isStarved ? 'Starvation (< 70% Pitch)' : 'Balanced';

      return [
        `"WS-${String(ws.workstationNumber).padStart(2, '0')}"`,
        `"${ws.name}"`,
        `"${opNames}"`,
        `"${machCats}"`,
        primaryOp?.employeeId || 'Unassigned',
        `"${primaryOp?.name || 'Unassigned'}"`,
        primaryOp?.skillGrade || 'N/A',
        primaryOp?.isPresent ? 'Present' : 'Absent',
        primaryMach?.machineId || 'Unassigned',
        `"${primaryMach?.brand || ''} ${primaryMach?.model || ''}"`,
        primaryMach?.status || 'N/A',
        ws.totalSmv.toFixed(2),
        Math.round(60 / (ws.totalSmv || 1)),
        `"${balanceStatus}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ...metadataRows.map((e) => e.join(',')),
        tableHeaders.join(','),
        ...dataRows.map((e) => e.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Line_Layout_${currentLayout.styleCode}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Line Layout to PDF (Formatted Printout)
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Line Layout & Workstation Balancing</h1>
            <span className="text-xs font-mono text-slate-500">· HRIS & Machine Inventory Mapping</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Map each sewing operation to HRIS Operators (1,000 staff pool) and Machines (2,000 equipment inventory).
            Group operations into multi-operator/multi-machine workstations or duplicate layout from another style.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Excel */}
          <button
            onClick={handleExportExcel}
            title="Download full line layout sheet in Excel / CSV format"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          {/* Export to PDF */}
          <button
            onClick={handleExportPDF}
            title="Print or save line layout balance sheet as PDF"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            <span>Export PDF</span>
          </button>

          {/* Copy Layout Option (Req #5) */}
          <button
            onClick={() => setIsCopyModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Copy className="h-4 w-4 text-blue-600" />
            <span>Copy Layout</span>
          </button>

          <button
            onClick={() => setIsNewLayoutModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Layout</span>
          </button>
        </div>
      </div>

      {/* Layout Selector & Style Info Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-slate-700">Active Layout:</label>
            <select
              value={selectedLayoutId}
              onChange={(e) => setSelectedLayoutId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden"
            >
              {lineLayouts.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.layoutName} · ({l.styleCode} - {l.customer})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              Garment Style: <strong className="text-slate-800">{currentLayout?.styleCode}</strong>
            </div>
            <div>·</div>
            <div>
              Buyer: <strong className="text-slate-800">{currentLayout?.customer}</strong>
            </div>
            <div>·</div>
            <div>
              Floor Line: <span className="font-mono text-slate-700">{currentLayout?.lineName}</span>
            </div>
          </div>
        </div>

        {/* 4-KPI Balance Summary Banner */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-slate-100 pt-4">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Total Workstations</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {currentLayout?.workstations.length}{' '}
              <span className="text-xs font-normal text-slate-500">stations</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-500">Line Pitch (Takt) Time</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {pitchTime} <span className="text-xs font-normal text-slate-500">min/pc</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-500">Total Style SMV</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {totalSmv.toFixed(2)} <span className="text-xs font-normal text-slate-500">min</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-500">Line Balancing Efficiency</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-700">
              {balancingEfficiency}%
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-500">Target Output / Hr</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {Math.round(60 / pitchTime)} <span className="text-xs font-normal text-slate-500">pcs/hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Line Balance Graph (Takt / Pitch Time Comparison) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Line Balancing Flow Diagram (Pitch Time vs Workstation SMV)
            </h2>
            <p className="text-[11px] text-slate-500">
              Pitch benchmark line is <strong className="font-mono text-slate-700">{pitchTime} min</strong>.
              Stations exceeding pitch time represent sewing bottlenecks!
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-slate-900" /> Balanced
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-rose-600" /> Bottleneck (&gt; Pitch)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-amber-500" /> Starvation (&lt; 70% Pitch)
            </span>
          </div>
        </div>

        {/* Bar chart container */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-end gap-2 overflow-x-auto pb-2 h-44">
          {currentLayout?.workstations.map((ws) => {
            const isBottleneck = ws.totalSmv > pitchTime * 1.15;
            const isStarved = ws.totalSmv < pitchTime * 0.7;
            const heightPercent = maxWsSmv > 0 ? Math.min(100, Math.round((ws.totalSmv / (maxWsSmv * 1.25)) * 100)) : 50;

            return (
              <div key={ws.id} className="flex-1 min-w-[54px] flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-12 hidden group-hover:flex flex-col items-center z-20 bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-md pointer-events-none">
                  <span>{ws.name}</span>
                  <span className="font-mono tabular-nums">
                    SMV: {ws.totalSmv.toFixed(2)}m (Pitch: {pitchTime}m)
                  </span>
                </div>

                <span className="text-[10px] font-mono tabular-nums text-slate-500">
                  {ws.totalSmv.toFixed(2)}m
                </span>

                <div className="w-full bg-slate-100 rounded-t-sm flex items-end h-28">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      isBottleneck ? 'bg-rose-600' : isStarved ? 'bg-amber-500' : 'bg-slate-900'
                    }`}
                  />
                </div>

                <span className="text-[11px] font-mono font-semibold text-slate-700">
                  WS-{ws.workstationNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workstations Grid / Operation - Operator - Machine Mapping (Req #4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Workstation Mappings</h2>
            <span className="text-xs text-slate-500">
              (Each station links Operations + HRIS Operator + Machine Inventory)
            </span>
          </div>

          <button
            onClick={() => setCurrentScreen('skill-study')}
            className="text-xs font-semibold text-slate-900 hover:underline"
          >
            Launch Capacity Study with Stop Watch →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentLayout?.workstations.map((ws) => {
            const isGrouped = ws.operationIds.length > 1;
            const primaryOpId = ws.operatorIds[0];
            const primaryMachId = ws.machineIds[0];

            const operator = primaryOpId ? getOperatorByEmployeeId(primaryOpId) : undefined;
            const machine = primaryMachId ? getMachineByMachineId(primaryMachId) : undefined;

            const isBottleneck = ws.totalSmv > pitchTime * 1.15;

            return (
              <div
                key={ws.id}
                className={`rounded-xl border bg-white p-4 shadow-2xs flex flex-col justify-between transition-all ${
                  isBottleneck ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Station Title & Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                          WS-{String(ws.workstationNumber).padStart(2, '0')}
                        </span>
                        {isGrouped && (
                          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            Grouped ({ws.operationIds.length} Ops)
                          </span>
                        )}
                        {isBottleneck && (
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            Bottleneck
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 truncate">{ws.name}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold tabular-nums text-slate-900">
                        {ws.totalSmv.toFixed(2)} min
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round(60 / (ws.totalSmv || 1))} pcs/hr
                      </div>
                    </div>
                  </div>

                  {/* Operations list in this workstation */}
                  <div className="py-2.5 space-y-1 text-xs">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Mapped Operation(s):
                    </span>
                    {ws.operationIds.map((opId) => {
                      const gsd = getGsdOp(opId);
                      return (
                        <div
                          key={opId}
                          className="flex items-center justify-between bg-slate-50 p-1.5 rounded text-slate-700"
                        >
                          <span className="truncate pr-2 font-medium">{gsd?.name || opId}</span>
                          <span className="font-mono text-[11px] shrink-0 text-slate-500">
                            {gsd?.smv.toFixed(2)}m · {gsd?.machineCategory}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Operator & Machine Section */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {/* Operator card */}
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-150 bg-slate-50/50">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-200 text-slate-700 font-mono text-xs font-bold shrink-0">
                          {operator?.skillGrade || 'B'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {operator?.name || 'Unassigned'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              ({operator?.employeeId})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span
                              className={`font-semibold ${
                                operator?.isPresent ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {operator?.isPresent ? 'Present' : 'Absent!'}
                            </span>
                            <span>·</span>
                            <span>{operator?.designation}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenSwapModal(
                            'operator',
                            ws.id,
                            operator?.employeeId,
                            `WS-${ws.workstationNumber}`
                          )
                        }
                        title="Swap Operator (QR Scan or HRIS)"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <QrCode className="h-3 w-3 text-slate-500" />
                        <span>Swap</span>
                      </button>
                    </div>

                    {/* Machine card */}
                    <div className="flex items-center justify-between p-2 rounded-lg border border-slate-150 bg-slate-50/50">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {machine?.machineId || 'MCH-0001'}
                          </span>
                          <span className="text-xs text-slate-700 truncate">
                            {machine?.brand} {machine?.model}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2">
                          <span>{machine?.category}</span>
                          <span>·</span>
                          <span
                            className={
                              machine?.status === 'Operational'
                                ? 'text-emerald-700 font-medium'
                                : 'text-amber-700 font-medium'
                            }
                          >
                            {machine?.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenSwapModal('machine', ws.id, machine?.machineId, `WS-${ws.workstationNumber}`)
                        }
                        title="Swap Machine (QR Scan or Inventory)"
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Cpu className="h-3 w-3 text-slate-500" />
                        <span>Swap</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card footer: Group / Split actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isGrouped ? (
                    <button
                      onClick={() => splitWorkstation(currentLayout.id, ws.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900"
                    >
                      <Split className="h-3 w-3" />
                      <span>Split Workstation</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenGroupModal(ws)}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                    >
                      <Layers className="h-3 w-3" />
                      <span>Group with other ops...</span>
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentScreen('skill-study')}
                    className="text-[11px] font-semibold text-slate-900 hover:underline"
                  >
                    Study Station →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grouping Modal */}
      {isGroupModalOpen && currentLayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Group Operations into Workstation
            </h3>
            <p className="text-xs text-slate-500">
              Select additional operations from this style to merge into this workstation. They will share
              the assigned operator and machine.
            </p>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
              {currentLayout.workstations
                .filter((w) => w.id !== targetGroupWsId)
                .flatMap((w) => w.operationIds)
                .map((opId) => {
                  const gsd = getGsdOp(opId);
                  const isChecked = selectedOpsToGroup.includes(opId);

                  return (
                    <label
                      key={opId}
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOpsToGroup((prev) => [...prev, opId]);
                          } else {
                            setSelectedOpsToGroup((prev) => prev.filter((id) => id !== opId));
                          }
                        }}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{gsd?.name || opId}</div>
                        <div className="text-[10px] text-slate-500">
                          SMV: {gsd?.smv.toFixed(2)}m · {gsd?.machineCategory}
                        </div>
                      </div>
                    </label>
                  );
                })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGrouping}
                disabled={selectedOpsToGroup.length === 0}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Merge Selected Ops ({selectedOpsToGroup.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Layout Modal */}
      {isNewLayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-3">Create New Line Layout</h3>
            <form onSubmit={handleCreateNewLayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Layout Name *
                </label>
                <input
                  type="text"
                  value={newLayoutName}
                  onChange={(e) => setNewLayoutName(e.target.value)}
                  placeholder="e.g. Line 02 - Polo Shirt Balanced Layout"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Garment Style *
                </label>
                <select
                  value={newLayoutStyleId}
                  onChange={(e) => setNewLayoutStyleId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                >
                  {styles.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.styleCode} - {s.styleName} ({s.customer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sewing Floor Line Name
                </label>
                <input
                  type="text"
                  value={newLayoutLineName}
                  onChange={(e) => setNewLayoutLineName(e.target.value)}
                  placeholder="e.g. Sewing Line 01 (Modular)"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLayoutModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Generate Layout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Copy Layout Modal (Req #5) */}
      <CopyLayoutModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        targetStyleId={currentLayout?.styleId}
      />

      {/* Operator & Machine Swap Modal (Req #7) */}
      <OperatorMachineSwapModal
        isOpen={swapModalConfig.isOpen}
        onClose={() => setSwapModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={swapModalConfig.type}
        layoutId={currentLayout?.id || ''}
        workstationId={swapModalConfig.workstationId}
        currentEntityId={swapModalConfig.currentEntityId}
        workstationName={swapModalConfig.workstationName}
      />
    </div>
  );
};
