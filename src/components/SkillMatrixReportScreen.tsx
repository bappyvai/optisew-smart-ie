import React, { useState, useMemo } from 'react';
import { useIE } from '../context/IEContext';
import { OperationCategory, SkillGrade } from '../types';
import {
  FileCheck2,
  Search,
  Download,
  Printer,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Layers,
  Calendar,
} from 'lucide-react';

export const SkillMatrixReportScreen: React.FC = () => {
  const { skillMatrixRecords, deleteSkillMatrixRecord, motherOperations, gsdOperations } = useIE();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | OperationCategory>('All');
  const [selectedOperation, setSelectedOperation] = useState<string>('All');
  const [selectedEfficiencySlab, setSelectedEfficiencySlab] = useState<string>('All');

  // Unique operations from records
  const operationNames = useMemo(() => {
    return Array.from(new Set(skillMatrixRecords.map((r) => r.operationName)));
  }, [skillMatrixRecords]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return skillMatrixRecords.filter((rec) => {
      // Category filter
      if (selectedCategory !== 'All' && rec.operationCategory !== selectedCategory) return false;

      // Operation filter
      if (selectedOperation !== 'All' && rec.operationName !== selectedOperation) return false;

      // Efficiency Slab filter
      if (selectedEfficiencySlab === 'above90' && rec.efficiencyPercent < 90) return false;
      if (
        selectedEfficiencySlab === '75to90' &&
        (rec.efficiencyPercent < 75 || rec.efficiencyPercent >= 90)
      )
        return false;
      if (
        selectedEfficiencySlab === '60to75' &&
        (rec.efficiencyPercent < 60 || rec.efficiencyPercent >= 75)
      )
        return false;
      if (selectedEfficiencySlab === 'below60' && rec.efficiencyPercent >= 60) return false;

      // Search query (Operator name, ID, style, designation)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        rec.operatorName.toLowerCase().includes(q) ||
        rec.operatorEmployeeId.toLowerCase().includes(q) ||
        rec.designation.toLowerCase().includes(q) ||
        rec.styleCode.toLowerCase().includes(q) ||
        rec.operationName.toLowerCase().includes(q) ||
        rec.motherOperation.toLowerCase().includes(q)
      );
    });
  }, [skillMatrixRecords, selectedCategory, selectedOperation, selectedEfficiencySlab, searchQuery]);

  // Aggregation Metrics
  const totalStudies = filteredRecords.length;
  const avgEfficiency =
    totalStudies > 0
      ? Number(
          (filteredRecords.reduce((sum, r) => sum + r.efficiencyPercent, 0) / totalStudies).toFixed(1)
        )
      : 0;
  const highPerformers = filteredRecords.filter((r) => r.efficiencyPercent >= 90).length;
  const trainingNeeded = filteredRecords.filter((r) => r.efficiencyPercent < 60).length;

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Capacity Taken Date',
      'Operator ID',
      'Operator Name',
      'Designation',
      'Operation Category',
      'Mother Operation',
      'Operation Name',
      'Style Code',
      'Customer',
      'Standard SMV (min)',
      'Observed Time (sec)',
      'Pieces Studied',
      'Efficiency %',
    ];

    const rows = filteredRecords.map((r) => [
      r.capacityTakenDate,
      r.operatorEmployeeId,
      `"${r.operatorName}"`,
      `"${r.designation}"`,
      r.operationCategory,
      `"${r.motherOperation}"`,
      `"${r.operationName}"`,
      r.styleCode,
      `"${r.customer}"`,
      r.gsdSmv,
      r.observedAvgCycleTimeSec,
      r.piecesStudied,
      r.efficiencyPercent,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Skill_Matrix_Capacity_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Skill Matrix Capacity Report</h1>
            <span className="text-xs font-mono text-slate-500">· Historical Audit & Efficiency Logs</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Audit report capturing Operation Category, Operation Wise, Operator Wise, Last Capacity (Efficiency) %,
            and Capacity Taken Date across garment production lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Capacity Audits
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {totalStudies}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Studies on record</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Average Factory Efficiency
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            {avgEfficiency}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Weighted capacity score</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Grade A (Star Operators ≥90%)
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-indigo-700 tabular-nums">
            {highPerformers}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Master level performance</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Training Required (&lt;60%)
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-rose-600 tabular-nums">
            {trainingNeeded}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs IE line intervention</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Operation Category Filter (Req #8: Operation Category) */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="All">All Categories (Basic / Inter / Adv)</option>
            <option value="Basic">Basic Category</option>
            <option value="Intermediate">Intermediate Category</option>
            <option value="Advance">Advance Category</option>
          </select>

          {/* Operation Wise Filter (Req #8: Operation wise) */}
          <select
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden max-w-[200px] truncate"
          >
            <option value="All">All Operations ({operationNames.length})</option>
            {operationNames.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          {/* Efficiency Slab Filter */}
          <select
            value={selectedEfficiencySlab}
            onChange={(e) => setSelectedEfficiencySlab(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="All">All Efficiency Slabs</option>
            <option value="above90">Grade A (≥ 90%)</option>
            <option value="75to90">Grade B (75% - 89%)</option>
            <option value="60to75">Grade C (60% - 74%)</option>
            <option value="below60">Grade D (&lt; 60%)</option>
          </select>
        </div>

        {/* Search Operator / ID / Style (Req #8: Operator wise) */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Operator Name, ID, Style..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Report Table (Req #8) */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Capacity Taken Date</th>
              <th className="py-3 px-4">Operator (ID & Name)</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Operation Category</th>
              <th className="py-3 px-4">Mother Operation</th>
              <th className="py-3 px-4">Operation Name</th>
              <th className="py-3 px-4">Style & Buyer</th>
              <th className="py-3 px-4 text-center">Pcs</th>
              <th className="py-3 px-4 text-right">Last Capacity %</th>
              <th className="py-3 px-4 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  No skill matrix records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const eff = record.efficiencyPercent;
                let gradeClass = 'text-slate-900';
                if (eff >= 90) gradeClass = 'text-emerald-700 font-bold';
                else if (eff >= 75) gradeClass = 'text-blue-700 font-bold';
                else if (eff >= 60) gradeClass = 'text-amber-700 font-bold';
                else gradeClass = 'text-rose-600 font-bold';

                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Capacity Taken Date */}
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {record.capacityTakenDate}
                    </td>

                    {/* Operator Name & ID */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{record.operatorName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{record.operatorEmployeeId}</div>
                    </td>

                    {/* Designation */}
                    <td className="py-3 px-4 text-slate-600">{record.designation}</td>

                    {/* Operation Category (Req #8) */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          record.operationCategory === 'Advance'
                            ? 'text-indigo-700'
                            : record.operationCategory === 'Intermediate'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {record.operationCategory}
                      </span>
                    </td>

                    {/* Mother Operation */}
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {record.motherOperation}
                    </td>

                    {/* Operation Name */}
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      {record.operationName}
                    </td>

                    {/* Style & Customer */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-slate-800">{record.styleCode}</div>
                      <div className="text-[11px] text-slate-500">{record.customer}</div>
                    </td>

                    {/* Pieces */}
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                      {record.piecesStudied}
                    </td>

                    {/* Last Capacity % (Efficiency %) */}
                    <td className={`py-3 px-4 text-right font-mono tabular-nums text-sm ${gradeClass}`}>
                      {record.efficiencyPercent.toFixed(1)}%
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteSkillMatrixRecord(record.id)}
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
