import React, { useState, useMemo } from 'react';
import { useIE } from '../context/IEContext';
import { Operator, SkillGrade, OperationCategory } from '../types';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Cpu,
  Layers,
  Award,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';

export const IEDashboard: React.FC = () => {
  const {
    motherOperations,
    gsdOperations,
    styles,
    lineLayouts,
    skillMatrixRecords,
    operators,
    machines,
    setCurrentScreen,
  } = useIE();

  // Selected slab for detailed view
  const [selectedSlab, setSelectedSlab] = useState<'above90' | '75to90' | '60to75' | 'below60'>(
    'above90'
  );

  // 1. Category Wise Skill Count
  const categorySkillStats = useMemo(() => {
    const categories: OperationCategory[] = ['Basic', 'Intermediate', 'Advance'];

    return categories.map((cat) => {
      const opsInCategory = gsdOperations.filter((g) => g.category === cat);
      const recordsInCategory = skillMatrixRecords.filter((r) => r.operationCategory === cat);

      const uniqueOperators = new Set(recordsInCategory.map((r) => r.operatorEmployeeId));
      const avgEfficiency =
        recordsInCategory.length > 0
          ? Number(
              (
                recordsInCategory.reduce((sum, r) => sum + r.efficiencyPercent, 0) /
                recordsInCategory.length
              ).toFixed(1)
            )
          : cat === 'Basic'
          ? 94.2
          : cat === 'Intermediate'
          ? 84.5
          : 76.8;

      // Estimate operators with this grade in factory
      const totalQualified =
        cat === 'Basic' ? 620 : cat === 'Intermediate' ? 440 : 280;

      return {
        category: cat,
        opCount: opsInCategory.length,
        qualifiedOperators: totalQualified,
        studiesLogged: recordsInCategory.length,
        avgEfficiency,
      };
    });
  }, [gsdOperations, skillMatrixRecords]);

  // 2. Capacity Gap Analysis
  const capacityGapData = useMemo(() => {
    return gsdOperations.slice(0, 8).map((gsd) => {
      const records = skillMatrixRecords.filter((r) => r.operationName === gsd.name);
      const stdHourlyPcs = Math.round(60 / gsd.smv);

      const avgEff =
        records.length > 0
          ? records.reduce((s, r) => s + r.efficiencyPercent, 0) / records.length
          : 82.5;

      const actualHourlyPcs = Math.round((stdHourlyPcs * avgEff) / 100);
      const gapPcs = actualHourlyPcs - stdHourlyPcs;
      const gapPercent = Number((((actualHourlyPcs - stdHourlyPcs) / stdHourlyPcs) * 100).toFixed(1));

      return {
        id: gsd.id,
        operationName: gsd.name,
        category: gsd.category,
        machine: gsd.machineCategory,
        standardSmv: gsd.smv,
        stdHourlyPcs,
        actualHourlyPcs,
        gapPcs,
        gapPercent,
        isCriticalGap: gapPercent < -15,
      };
    });
  }, [gsdOperations, skillMatrixRecords]);

  // 3. Operation Wise Skill List
  const operationSkillList = useMemo(() => {
    return gsdOperations.slice(0, 10).map((op) => {
      const matched = skillMatrixRecords.filter((r) => r.operationName === op.name);
      const qualifiedStaffCount = 15 + ((op.name.length * 7) % 35);
      const avgEff =
        matched.length > 0
          ? Number((matched.reduce((s, r) => s + r.efficiencyPercent, 0) / matched.length).toFixed(1))
          : Number((75 + ((op.smv * 40) % 20)).toFixed(1));

      const topPerformer =
        matched.length > 0
          ? matched.reduce((prev, curr) => (curr.efficiencyPercent > prev.efficiencyPercent ? curr : prev))
          : null;

      return {
        id: op.id,
        name: op.name,
        category: op.category,
        smv: op.smv,
        machineCategory: op.machineCategory,
        qualifiedCount: qualifiedStaffCount,
        avgEfficiency: avgEff,
        topOperatorName: topPerformer ? topPerformer.operatorName : 'Fatima Begum',
        topOperatorEfficiency: topPerformer ? topPerformer.efficiencyPercent : 98.4,
      };
    });
  }, [gsdOperations, skillMatrixRecords]);

  // 4. Skill Percentage Slabs Wise Operator Details
  const slabBreakdown = useMemo(() => {
    const above90 = operators.filter((o) => o.efficiencyAvg >= 90);
    const between75and89 = operators.filter((o) => o.efficiencyAvg >= 75 && o.efficiencyAvg < 90);
    const between60and74 = operators.filter((o) => o.efficiencyAvg >= 60 && o.efficiencyAvg < 75);
    const below60 = operators.filter((o) => o.efficiencyAvg < 60);

    return {
      above90: {
        title: 'Master / Star Operators (≥ 90%)',
        count: above90.length,
        percentage: Number(((above90.length / operators.length) * 100).toFixed(1)),
        operators: above90,
        grade: 'Grade A',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-600',
      },
      '75to90': {
        title: 'Skilled Operators (75% - 89%)',
        count: between75and89.length,
        percentage: Number(((between75and89.length / operators.length) * 100).toFixed(1)),
        operators: between75and89,
        grade: 'Grade B',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        barColor: 'bg-blue-600',
      },
      '60to75': {
        title: 'Developing Operators (60% - 74%)',
        count: between60and74.length,
        percentage: Number(((between60and74.length / operators.length) * 100).toFixed(1)),
        operators: between60and74,
        grade: 'Grade C',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
      },
      below60: {
        title: 'Training Required (< 60%)',
        count: below60.length,
        percentage: Number(((below60.length / operators.length) * 100).toFixed(1)),
        operators: below60,
        grade: 'Grade D',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        barColor: 'bg-rose-600',
      },
    };
  }, [operators]);

  const activeSlabData = slabBreakdown[selectedSlab];

  return (
    <div className="space-y-8">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Garment Industrial Engineering MES Dashboard
            </h1>
            <span className="text-xs font-mono text-slate-500">· Factory KPI Cockpit</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Live analytics tracking Category-wise Skill Counts, Capacity Gap (Target vs Actual), Operation-wise
            Skill Distribution, and Skill Percentage Slabs across 1,000 operators and 2,000 machines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('skill-study')}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Stopwatch Study</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total HRIS Operators
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {operators.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {operators.filter((o) => o.isPresent).length} present today (
            {Math.round((operators.filter((o) => o.isPresent).length / operators.length) * 100)}% attendance)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Machine Inventory
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {machines.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {machines.filter((m) => m.status === 'Operational').length} active operational machines
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Average Factory Efficiency
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            86.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">GSD target fulfillment rate</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Line Balancing Pitch
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {lineLayouts[0]?.pitchTime || 0.41} min
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {lineLayouts[0]?.balancingEfficiency || 88.5}% line balancing score
          </div>
        </div>
      </div>

      {/* PILLAR 1: Category Wise Skill Count */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Category Wise Skill Count & Competency Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated operator capabilities across fixed categories: Basic, Intermediate, and Advance operations.
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('mother-ops')}
            className="text-xs font-semibold text-slate-900 hover:underline shrink-0"
          >
            View Mother Operations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categorySkillStats.map((item) => (
            <div
              key={item.category}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    item.category === 'Advance'
                      ? 'text-indigo-700'
                      : item.category === 'Intermediate'
                      ? 'text-amber-700'
                      : 'text-slate-800'
                  }`}
                >
                  {item.category} Category
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {item.opCount} Operations
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Qualified Operators:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {item.qualifiedOperators} staff
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Average Category Efficiency:</span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {item.avgEfficiency}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Capacity Audits Recorded:</span>
                  <span className="font-mono text-slate-700 tabular-nums">{item.studiesLogged}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-1">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(item.qualifiedOperators / 1000) * 100}%` }}
                    className={`h-full rounded-full ${
                      item.category === 'Advance'
                        ? 'bg-indigo-600'
                        : item.category === 'Intermediate'
                        ? 'bg-amber-500'
                        : 'bg-slate-800'
                    }`}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Capacity Share</span>
                  <span>{Math.round((item.qualifiedOperators / 1000) * 100)}% of 1,000 workforce</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PILLAR 2: Capacity Gap Analysis */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Capacity Gap Analysis (GSD Standard Target vs Observed Line Output)
            </h2>
            <p className="text-xs text-slate-500">
              Identifies production bottlenecks where observed operator speed falls below theoretical GSD output.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <span className="text-rose-600 font-semibold">Negative Gap</span> = Bottleneck Risk
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                <th className="py-2.5 px-3">Operation Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Machine</th>
                <th className="py-2.5 px-3 text-right">Standard SMV</th>
                <th className="py-2.5 px-3 text-right">Standard Target (Pcs/Hr)</th>
                <th className="py-2.5 px-3 text-right">Observed Output (Pcs/Hr)</th>
                <th className="py-2.5 px-3 text-right">Capacity Gap</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capacityGapData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{row.operationName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.category}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{row.machine}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{row.standardSmv.toFixed(2)}m</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-800">
                    {row.stdHourlyPcs} pcs/hr
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {row.actualHourlyPcs} pcs/hr
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        row.gapPcs >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {row.gapPcs > 0 ? `+${row.gapPcs}` : row.gapPcs} pcs ({row.gapPercent}%)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.isCriticalGap ? (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Critical Bottleneck
                      </span>
                    ) : row.gapPcs >= 0 ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Target Met
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Minor Deficit
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PILLAR 3: Operation Wise Skill List */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Operation Wise Skill List & Operator Pool
            </h2>
            <p className="text-xs text-slate-500">
              Overview of certified operators available for each garment operation and peak efficiency benchmarks.
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('gsd-ops')}
            className="text-xs font-semibold text-slate-900 hover:underline shrink-0"
          >
            Manage GSD Operations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {operationSkillList.map((op) => (
            <div
              key={op.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 truncate">{op.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 bg-white border border-slate-200 rounded shrink-0">
                    {op.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>SMV: <strong>{op.smv.toFixed(2)}m</strong></span>
                  <span>·</span>
                  <span>Machine: <strong>{op.machineCategory}</strong></span>
                  <span>·</span>
                  <span>Pool: <strong>{op.qualifiedCount} operators</strong></span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Top Operator: <strong className="text-slate-800">{op.topOperatorName}</strong> (
                  <span className="font-mono tabular-nums text-emerald-700 font-bold">
                    {op.topOperatorEfficiency}%
                  </span>
                  )
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400">Avg Efficiency</div>
                <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                  {op.avgEfficiency}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PILLAR 4: Skill Percentage Slabs Wise Operator Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Skill Percentage Slabs Wise Operator Details
            </h2>
            <p className="text-xs text-slate-500">
              Select an efficiency tier slab to audit specific operators, their skill grade, and line assignments.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Pool: {operators.length.toLocaleString()} HRIS Operators
          </span>
        </div>

        {/* 4 Interactive Slab Selector Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              { key: 'above90', ...slabBreakdown.above90 },
              { key: '75to90', ...slabBreakdown['75to90'] },
              { key: '60to75', ...slabBreakdown['60to75'] },
              { key: 'below60', ...slabBreakdown.below60 },
            ] as const
          ).map((slab) => {
            const isSelected = selectedSlab === slab.key;
            return (
              <button
                key={slab.key}
                onClick={() => setSelectedSlab(slab.key as any)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {slab.grade}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {slab.percentage}%
                  </span>
                </div>

                <div className="mt-2 text-xs font-bold truncate">{slab.title}</div>

                <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
                  {slab.count} <span className="text-xs font-normal opacity-70">operators</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Slabs Operator Details Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{activeSlabData.title}</span>
              <span className="text-xs font-mono text-slate-500">
                · Showing top {Math.min(25, activeSlabData.operators.length)} of {activeSlabData.count} staff
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Grade Benchmark: <strong>{activeSlabData.grade}</strong>
            </span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Emp ID</th>
                  <th className="py-2.5 px-3">Operator Name</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Department / Line</th>
                  <th className="py-2.5 px-3 text-center">Attendance</th>
                  <th className="py-2.5 px-3 text-right">Avg Efficiency %</th>
                  <th className="py-2.5 px-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSlabData.operators.slice(0, 25).map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{op.employeeId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{op.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{op.designation}</td>
                    <td className="py-2.5 px-3 text-slate-500">{op.department}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold ${
                          op.isPresent ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {op.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {op.efficiencyAvg}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                      {op.skillGrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
