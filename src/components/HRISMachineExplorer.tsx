import React, { useState, useMemo } from 'react';
import { useIE } from '../context/IEContext';
import { Operator, Machine, SkillGrade, MachineCategory, MachineStatus } from '../types';
import { Users, Cpu, Search, QrCode, Filter, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HRISMachineExplorer: React.FC = () => {
  const { operators, machines, updateOperator, updateMachine } = useIE();

  const [activeTab, setActiveTab] = useState<'operators' | 'machines'>('operators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedAttendance, setSelectedAttendance] = useState<string>('all');
  const [selectedMachineCategory, setSelectedMachineCategory] = useState<string>('all');
  const [selectedMachineStatus, setSelectedMachineStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // Filtered operators
  const filteredOperators = useMemo(() => {
    return operators.filter((op) => {
      if (selectedGrade !== 'all' && op.skillGrade !== selectedGrade) return false;
      if (selectedAttendance === 'present' && !op.isPresent) return false;
      if (selectedAttendance === 'absent' && op.isPresent) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        op.name.toLowerCase().includes(q) ||
        op.employeeId.toLowerCase().includes(q) ||
        op.designation.toLowerCase().includes(q) ||
        op.department.toLowerCase().includes(q)
      );
    });
  }, [operators, selectedGrade, selectedAttendance, searchQuery]);

  // Filtered machines
  const filteredMachines = useMemo(() => {
    return machines.filter((m) => {
      if (selectedMachineCategory !== 'all' && m.category !== selectedMachineCategory) return false;
      if (selectedMachineStatus !== 'all' && m.status !== selectedMachineStatus) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.machineId.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        m.floorLine.toLowerCase().includes(q)
      );
    });
  }, [machines, selectedMachineCategory, selectedMachineStatus, searchQuery]);

  // Paginated slices
  const currentOperatorsPage = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOperators.slice(start, start + PAGE_SIZE);
  }, [filteredOperators, page]);

  const currentMachinesPage = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredMachines.slice(start, start + PAGE_SIZE);
  }, [filteredMachines, page]);

  const totalPages = Math.ceil(
    (activeTab === 'operators' ? filteredOperators.length : filteredMachines.length) / PAGE_SIZE
  );

  const toggleAttendance = (op: Operator) => {
    updateOperator(op.id, { isPresent: !op.isPresent });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              HRIS Staff & Machine Inventory Explorer
            </h1>
            <span className="text-xs font-mono text-slate-500">· 1,000 Operators · 2,000 Machines</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            Live integration repository connecting the factory's 1,000 sewing operators and 2,000 sewing machines.
            Simulates optical QR badge scans, daily floor attendance, and machinery status for line layout balancing.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => {
              setActiveTab('operators');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'operators'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>1,000 Operators</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('machines');
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'machines'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>2,000 Machines</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'operators' ? (
            <>
              {/* Grade filter */}
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="all">All Skill Grades (A / B / C / D)</option>
                <option value="A">Grade A (≥ 90%)</option>
                <option value="B">Grade B (75% - 89%)</option>
                <option value="C">Grade C (60% - 74%)</option>
                <option value="D">Grade D (&lt; 60%)</option>
              </select>

              {/* Attendance filter */}
              <select
                value={selectedAttendance}
                onChange={(e) => {
                  setSelectedAttendance(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="all">All Attendance</option>
                <option value="present">Present on Floor Today</option>
                <option value="absent">Absent Today (Requires Swap)</option>
              </select>
            </>
          ) : (
            <>
              {/* Machine category filter */}
              <select
                value={selectedMachineCategory}
                onChange={(e) => {
                  setSelectedMachineCategory(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="all">All Machine Categories</option>
                <option value="SNLS">Single Needle Lockstitch (SNLS)</option>
                <option value="DNLS">Double Needle Lockstitch (DNLS)</option>
                <option value="Overlock 4T">Overlock 4-Thread</option>
                <option value="Overlock 5T">Overlock 5-Thread</option>
                <option value="Flatlock Cylinder">Flatlock Cylinder Bed</option>
                <option value="Flatlock Flatbed">Flatlock Flatbed</option>
                <option value="Kansai Multi-Needle">Kansai Multi-Needle</option>
                <option value="Button Hole (Auto)">Electronic Button Hole</option>
                <option value="Button Attach">Button Attach</option>
                <option value="Bartack">Electronic Bartack</option>
                <option value="Ironing / Press">Steam Iron Table</option>
              </select>

              {/* Machine status filter */}
              <select
                value={selectedMachineStatus}
                onChange={(e) => {
                  setSelectedMachineStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="Operational">Operational</option>
                <option value="Idle">Idle</option>
                <option value="In-Maintenance">In-Maintenance</option>
                <option value="Calibration Due">Calibration Due</option>
              </select>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={
              activeTab === 'operators'
                ? 'Search 1,000 operators by Name, ID, line...'
                : 'Search 2,000 machines by ID, Brand, model...'
            }
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {activeTab === 'operators' ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Department / Line</th>
                <th className="py-3 px-4 text-center">Skill Grade</th>
                <th className="py-3 px-4 text-right">Avg Efficiency</th>
                <th className="py-3 px-4 text-center">Floor Attendance</th>
                <th className="py-3 px-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOperatorsPage.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No operators found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentOperatorsPage.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{op.employeeId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{op.name}</td>
                    <td className="py-3 px-4 text-slate-600">{op.designation}</td>
                    <td className="py-3 px-4 text-slate-500">{op.department}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {op.skillGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      {op.efficiencyAvg}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleAttendance(op)}
                        title="Click to toggle Present / Absent status"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          op.isPresent
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {op.isPresent ? 'Present' : 'Absent (Click to toggle)'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">{op.joinedDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Machine ID</th>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Floor / Line Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4 text-right">Purchase Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentMachinesPage.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No machines found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentMachinesPage.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{m.machineId}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{m.brand}</span>{' '}
                      <span className="text-slate-600">{m.model}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{m.category}</td>
                    <td className="py-3 px-4 text-slate-600">{m.floorLine}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          m.status === 'Operational'
                            ? 'text-emerald-700'
                            : m.status === 'In-Maintenance'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{m.serialNumber}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {m.purchaseYear}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1} to{' '}
          {Math.min(
            page * PAGE_SIZE,
            activeTab === 'operators' ? filteredOperators.length : filteredMachines.length
          )}{' '}
          of{' '}
          <strong className="text-slate-900">
            {activeTab === 'operators'
              ? filteredOperators.length.toLocaleString()
              : filteredMachines.length.toLocaleString()}
          </strong>{' '}
          items
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono tabular-nums">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
