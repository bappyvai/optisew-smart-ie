import React, { useState, useEffect, useRef } from 'react';
import { useIE } from '../context/IEContext';
import { Workstation, LineLayout, Style, CycleLap, OperationCategory } from '../types';
import { OperatorMachineSwapModal } from './OperatorMachineSwapModal';
import {
  Timer,
  Play,
  Square,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Cpu,
  Layers,
  Shirt,
  User,
  History,
  TrendingUp,
} from 'lucide-react';

export const SkillMatrixStudyScreen: React.FC = () => {
  const {
    styles,
    lineLayouts,
    getOperatorByEmployeeId,
    getMachineByMachineId,
    gsdOperations,
    addSkillMatrixRecord,
    skillMatrixRecords,
  } = useIE();

  // Selection states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('Ralph Lauren');
  const [selectedStyleId, setSelectedStyleId] = useState<string>(styles[0]?.id || '');
  const [activeWsId, setActiveWsId] = useState<string>('');

  // Performance Rating (standard IE rating factor, 100% nominal)
  const [performanceRating, setPerformanceRating] = useState<number>(100);

  // Stopwatch state
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [currentLapStartMs, setCurrentLapStartMs] = useState<number>(0);
  const [cycleLaps, setCycleLaps] = useState<CycleLap[]>([]);

  // Swap modal state (Req #7)
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

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Unique list of customers from styles
  const customers = Array.from(new Set(styles.map((s) => s.customer)));

  // Filter styles by customer
  const customerStyles = styles.filter((s) => s.customer === selectedCustomerId);

  // Active style
  const currentStyle = styles.find((s) => s.id === selectedStyleId) || customerStyles[0] || styles[0];

  // Associated Line Layout for this style
  const currentLayout =
    lineLayouts.find((l) => l.styleId === currentStyle?.id) || lineLayouts[0];

  // Set default active workstation when layout changes
  useEffect(() => {
    if (currentLayout?.workstations[0] && !activeWsId) {
      setActiveWsId(currentLayout.workstations[0].id);
    }
  }, [currentLayout]);

  const activeWorkstation =
    currentLayout?.workstations.find((w) => w.id === activeWsId) ||
    currentLayout?.workstations[0];

  // Get primary operator & machine for active workstation
  const primaryOperatorId = activeWorkstation?.operatorIds[0];
  const primaryMachineId = activeWorkstation?.machineIds[0];
  const currentOperator = primaryOperatorId ? getOperatorByEmployeeId(primaryOperatorId) : undefined;
  const currentMachine = primaryMachineId ? getMachineByMachineId(primaryMachineId) : undefined;

  // Primary GSD operation for this workstation
  const primaryGsdId = activeWorkstation?.operationIds[0];
  const currentGsdOp = gsdOperations.find((g) => g.id === primaryGsdId) || gsdOperations[0];

  // Stopwatch animation loop
  useEffect(() => {
    if (timerRunning) {
      startTimeRef.current = Date.now() - elapsedMs;
      timerRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 25);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Requirement #6:
  // "Stop what start and stop will be count one pcs again start and stop means another pice will increase."
  const handleStartStopToggle = () => {
    if (!timerRunning) {
      // START: start measuring a new piece cycle
      setCurrentLapStartMs(elapsedMs);
      setTimerRunning(true);
    } else {
      // STOP: stop and count 1 piece!
      setTimerRunning(false);
      const pieceTimeMs = elapsedMs - currentLapStartMs;
      const pieceTimeSec = Number((pieceTimeMs / 1000).toFixed(2));

      const newLap: CycleLap = {
        pieceNumber: cycleLaps.length + 1,
        cycleTimeSec: pieceTimeSec > 0 ? pieceTimeSec : 1.0,
        timestamp: new Date().toLocaleTimeString(),
      };
      setCycleLaps((prev) => [...prev, newLap]);
    }
  };

  const handleResetStopwatch = () => {
    setTimerRunning(false);
    setElapsedMs(0);
    setCurrentLapStartMs(0);
    setCycleLaps([]);
  };

  // Calculations for efficiency
  const totalPieces = cycleLaps.length;
  const totalObservedSec = cycleLaps.reduce((sum, lap) => sum + lap.cycleTimeSec, 0);
  const avgObservedSec = totalPieces > 0 ? Number((totalObservedSec / totalPieces).toFixed(2)) : 0;
  const avgObservedMin = Number((avgObservedSec / 60).toFixed(3));

  // Actual GSD SMV
  const gsdSmv = activeWorkstation?.totalSmv || currentGsdOp?.smv || 0.45;

  // Efficiency calculation: (GSD SMV / Observed Avg Time in Min) * 100% * (Rating / 100)
  const calculatedEfficiency =
    avgObservedMin > 0 ? Number(((gsdSmv / avgObservedMin) * (performanceRating / 100) * 100).toFixed(1)) : 0;

  // Format millisecond timer display MM:SS.SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
      hundredths
    ).padStart(2, '0')}`;
  };

  // Save record to Skill Matrix table (Req #6)
  const handleSaveToSkillMatrix = () => {
    if (!currentOperator || !currentStyle || totalPieces === 0) return;

    addSkillMatrixRecord({
      operatorId: currentOperator.id,
      operatorEmployeeId: currentOperator.employeeId,
      operatorName: currentOperator.name,
      designation: currentOperator.designation,
      customer: currentStyle.customer,
      styleId: currentStyle.id,
      styleCode: currentStyle.styleCode,
      styleName: currentStyle.styleName,
      motherOperation: currentGsdOp?.motherOperationName || 'Assembly Seam',
      operationName: currentGsdOp?.name || 'Sewing Seam',
      operationCategory: currentGsdOp?.category || 'Basic',
      gsdSmv,
      observedAvgCycleTimeSec: avgObservedSec,
      observedAvgCycleTimeMin: avgObservedMin,
      piecesStudied: totalPieces,
      efficiencyPercent: calculatedEfficiency,
      cycleLaps,
      machineId: currentMachine?.machineId,
      workstationNumber: activeWorkstation?.workstationNumber,
      studyRatingPercent: performanceRating,
    });

    handleResetStopwatch();
  };

  // Quick swap opener (Req #7)
  const handleOpenSwap = (type: 'operator' | 'machine') => {
    if (!currentLayout || !activeWorkstation) return;
    setSwapModalConfig({
      isOpen: true,
      type,
      workstationId: activeWorkstation.id,
      currentEntityId: type === 'operator' ? currentOperator?.employeeId : currentMachine?.machineId,
      workstationName: `WS-${activeWorkstation.workstationNumber}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Skill Matrix Cycle Time Capacity Study
            </h1>
            <span className="text-xs font-mono text-slate-500">· Interactive Piece Counter Stopwatch</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Select Customer and Style to open the sewing line layout. Conduct real-time cycle time studies using the
            stopwatch (Start & Stop counts 1 piece). If an operator is absent, swap them instantly via QR scan or HRIS.
          </p>
        </div>

        {/* Quick Customer & Style Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Select Customer */}
          <div>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                const firstStyleOfCustomer = styles.find((s) => s.customer === e.target.value);
                if (firstStyleOfCustomer) setSelectedStyleId(firstStyleOfCustomer.id);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-slate-900 focus:outline-hidden"
            >
              {customers.map((c) => (
                <option key={c} value={c}>
                  Customer: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Select Style */}
          <div>
            <select
              value={selectedStyleId}
              onChange={(e) => setSelectedStyleId(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-slate-900 focus:outline-hidden"
            >
              {customerStyles.map((s) => (
                <option key={s.id} value={s.id}>
                  Style: {s.styleCode} ({s.styleName.slice(0, 24)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workstation Selector Carousel / Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Workstation for Capacity Study
            </span>
            <span className="text-xs font-mono text-slate-400">
              · Layout: {currentLayout?.layoutName}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {currentLayout?.workstations.length} Active Stations
          </span>
        </div>

        {/* Horizontal workstation selector cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1">
          {currentLayout?.workstations.map((ws) => {
            const isSelected = ws.id === activeWorkstation?.id;
            const op = ws.operatorIds[0] ? getOperatorByEmployeeId(ws.operatorIds[0]) : undefined;

            return (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWsId(ws.id);
                  handleResetStopwatch();
                }}
                className={`min-w-[190px] text-left p-2.5 rounded-lg border transition-all shrink-0 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold">WS-{String(ws.workstationNumber).padStart(2, '0')}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {ws.totalSmv.toFixed(2)}m
                  </span>
                </div>

                <div className={`mt-1 text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {ws.name.replace(/^WS-\d+:\s*/, '')}
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className={`truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {op?.name || 'Unassigned'}
                  </span>
                  <span
                    className={`font-semibold shrink-0 ml-1 ${
                      op?.isPresent ? 'text-emerald-500' : 'text-rose-400'
                    }`}
                  >
                    {op?.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Left Station & Operator Card | Right Interactive Digital Stopwatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Workstation & Operator Card with Quick Swap (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Study Subject</span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                WS-{activeWorkstation?.workstationNumber}: {activeWorkstation?.name.replace(/^WS-\d+:\s*/, '')}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-800">
              GSD SMV: {gsdSmv.toFixed(2)} min
            </span>
          </div>

          {/* Absent Alert Banner (Req #7) */}
          {currentOperator && !currentOperator.isPresent && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong className="font-semibold">Operator Absent Today:</strong> {currentOperator.name} (
                  {currentOperator.employeeId}) is marked absent.
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Substitute operator must be scanned or assigned before taking capacity study.
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenSwap('operator')}
                className="rounded bg-rose-600 px-2.5 py-1 text-white text-[11px] font-semibold hover:bg-rose-700 shrink-0"
              >
                Scan Substitute
              </button>
            </div>
          )}

          {/* Operator Detail Box */}
          <div className="rounded-lg border border-slate-200 p-3.5 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                Assigned Operator
              </span>
              <button
                onClick={() => handleOpenSwap('operator')}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-900 hover:underline"
              >
                <QrCode className="h-3 w-3" />
                <span>Swap / Scan QR (Req #7)</span>
              </button>
            </div>

            {currentOperator ? (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-mono text-base font-bold shrink-0">
                  {currentOperator.skillGrade}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{currentOperator.name}</span>
                    <span className="font-mono text-xs text-slate-500">({currentOperator.employeeId})</span>
                  </div>
                  <div className="text-xs text-slate-600">{currentOperator.designation}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Dept: {currentOperator.department}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold ${
                        currentOperator.isPresent ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {currentOperator.isPresent ? 'Present on Floor' : 'Absent Today'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No operator assigned</div>
            )}
          </div>

          {/* Machine Detail Box */}
          <div className="rounded-lg border border-slate-200 p-3.5 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-slate-500" />
                Assigned Sewing Machine
              </span>
              <button
                onClick={() => handleOpenSwap('machine')}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-900 hover:underline"
              >
                <QrCode className="h-3 w-3" />
                <span>Swap Machine</span>
              </button>
            </div>

            {currentMachine ? (
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{currentMachine.machineId}</span>
                  <span className="font-semibold text-slate-800">
                    {currentMachine.brand} {currentMachine.model}
                  </span>
                </div>
                <div className="text-slate-500 flex justify-between text-[11px]">
                  <span>Category: {currentMachine.category}</span>
                  <span className={currentMachine.status === 'Operational' ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                    Status: {currentMachine.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No machine assigned</div>
            )}
          </div>

          {/* Operation & SMV Info */}
          <div className="rounded-lg border border-slate-200 p-3.5 text-xs space-y-1.5 bg-slate-50/50">
            <span className="text-slate-500">Operation Details:</span>
            <div className="font-bold text-slate-900">{currentGsdOp.name}</div>
            <div className="text-slate-600 flex justify-between text-[11px]">
              <span>Mother Operation: <strong>{currentGsdOp.motherOperationName}</strong></span>
              <span className="font-medium">Category: {currentGsdOp.category}</span>
            </div>
            <div className="text-slate-600 flex justify-between text-[11px]">
              <span>Standard GSD SMV: <strong>{gsdSmv.toFixed(2)} min ({Math.round(gsdSmv * 60)}s)</strong></span>
              <span>100% Target: {Math.round(60 / gsdSmv)} pcs/hr</span>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Stopwatch Console & Piece Counter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-900 bg-slate-950 text-white p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Digital Industrial Stopwatch
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {timerRunning ? 'MEASURING CYCLE...' : 'READY / PAUSED'}
              </span>
            </div>

            {/* Giant Millisecond Stopwatch Display */}
            <div className="text-center py-4">
              <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums text-white selection:bg-none">
                {formatTime(elapsedMs)}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                {timerRunning
                  ? `Measuring Piece #${totalPieces + 1}... Press "Stop & Record Piece" when completed`
                  : totalPieces === 0
                  ? 'Click "Start Stopwatch" to begin timing piece #1'
                  : `Piece #${totalPieces} recorded · Press "Start Stopwatch" for piece #${totalPieces + 1}`}
              </div>
            </div>

            {/* Stopwatch Control Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartStopToggle}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  timerRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Square className="h-4 w-4 fill-current" />
                    <span>Stop & Count Piece (+1 Pc)</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>{totalPieces === 0 ? 'Start Stopwatch' : `Start Piece #${totalPieces + 1}`}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetStopwatch}
                disabled={timerRunning || elapsedMs === 0}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Study</span>
              </button>
            </div>

            {/* Live IE Calculation Dashboard inside Stopwatch */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Pieces Studied</span>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  {totalPieces} <span className="text-xs text-slate-400 font-normal">pcs</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Avg Observed Time</span>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  {avgObservedSec}s
                </div>
                <div className="text-[10px] text-slate-400 font-mono">({avgObservedMin} min)</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Standard GSD SMV</span>
                <div className="text-xl font-bold font-mono text-slate-300 tabular-nums mt-0.5">
                  {gsdSmv.toFixed(2)}m
                </div>
                <div className="text-[10px] text-slate-400 font-mono">({Math.round(gsdSmv * 60)}s)</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Efficiency %</span>
                <div
                  className={`text-2xl font-black font-mono tabular-nums mt-0.5 ${
                    calculatedEfficiency >= 90
                      ? 'text-emerald-400'
                      : calculatedEfficiency >= 75
                      ? 'text-blue-400'
                      : calculatedEfficiency >= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {calculatedEfficiency > 0 ? `${calculatedEfficiency}%` : '—'}
                </div>
              </div>
            </div>

            {/* IE Performance Rating adjustment slider */}
            <div className="flex items-center justify-between gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                IE Pace Rating: <strong className="text-white font-mono">{performanceRating}%</strong>
              </span>
              <input
                type="range"
                min="80"
                max="120"
                step="5"
                value={performanceRating}
                onChange={(e) => setPerformanceRating(parseInt(e.target.value))}
                className="w-48 accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Nominal 100%</span>
            </div>

            {/* Save into Skill Matrix Button */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {totalPieces > 0 ? (
                  <span>
                    Study completed with <strong>{totalPieces} pieces</strong> recorded.
                  </span>
                ) : (
                  <span>Record at least 1 piece to save into Skill Matrix.</span>
                )}
              </div>

              <button
                onClick={handleSaveToSkillMatrix}
                disabled={totalPieces === 0 || timerRunning}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                <span>Save to Skill Matrix</span>
              </button>
            </div>
          </div>

          {/* Recorded Piece Cycle Times Log */}
          {cycleLaps.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Study Piece Laps ({cycleLaps.length} Pcs Counted)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {cycleLaps.map((lap) => (
                  <div
                    key={lap.pieceNumber}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center text-xs"
                  >
                    <div className="text-[10px] text-slate-500">Piece #{lap.pieceNumber}</div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">
                      {lap.cycleTimeSec}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
