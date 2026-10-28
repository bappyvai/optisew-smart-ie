import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  MotherOperation,
  GSDOperation,
  Style,
  Operator,
  Machine,
  LineLayout,
  SkillMatrixRecord,
  Workstation,
  OperationCategory,
  MachineCategory,
} from '../types';
import {
  INITIAL_MOTHER_OPERATIONS,
  INITIAL_GSD_OPERATIONS,
  INITIAL_STYLES,
  INITIAL_LINE_LAYOUTS,
  INITIAL_SKILL_MATRIX_RECORDS,
  generate1000Operators,
  generate2000Machines,
} from '../data/mockData';

export type ScreenType =
  | 'dashboard'
  | 'mother-ops'
  | 'gsd-ops'
  | 'style-master'
  | 'style-mapping'
  | 'line-layout'
  | 'skill-study'
  | 'skill-report'
  | 'hris-machines';

interface IEContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;

  // Authentication
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  currentUser: { username: string; role: string; name: string } | null;

  // Mother Operations
  motherOperations: MotherOperation[];
  addMotherOperation: (name: string, category: OperationCategory, description?: string) => void;
  updateMotherOperation: (id: string, name: string, category: OperationCategory, description?: string) => void;
  deleteMotherOperation: (id: string) => void;

  // GSD Operations
  gsdOperations: GSDOperation[];
  addGSDOperation: (data: Omit<GSDOperation, 'id' | 'code'>) => void;
  updateGSDOperation: (id: string, data: Partial<GSDOperation>) => void;
  deleteGSDOperation: (id: string) => void;

  // Styles & GSD Mapping
  styles: Style[];
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
  addStyle: (style: Omit<Style, 'id' | 'totalSmv' | 'gsdOperations' | 'createdDate'>) => Style;
  updateStyle: (id: string, updates: Partial<Style>) => void;
  deleteStyle: (id: string) => void;
  addOperationToStyle: (styleId: string, gsdOpId: string) => void;
  removeOperationFromStyle: (styleId: string, mappingId: string) => void;
  reorderStyleOperations: (styleId: string, startIndex: number, endIndex: number) => void;

  // HRIS 1000 Operators & 2000 Machines
  operators: Operator[];
  machines: Machine[];
  updateOperator: (id: string, updates: Partial<Operator>) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  getOperatorByEmployeeId: (empId: string) => Operator | undefined;
  getMachineByMachineId: (machId: string) => Machine | undefined;

  // Line Layouts
  lineLayouts: LineLayout[];
  selectedLayoutId: string;
  setSelectedLayoutId: (id: string) => void;
  createLineLayout: (styleId: string, layoutName: string, lineName: string) => LineLayout;
  updateLineLayout: (id: string, updates: Partial<LineLayout>) => void;
  copyLineLayout: (sourceLayoutId: string, targetStyleId: string, newLayoutName: string) => LineLayout;
  groupOperationsIntoWorkstation: (layoutId: string, workstationId: string, operationIdsToGroup: string[]) => void;
  splitWorkstation: (layoutId: string, workstationId: string) => void;
  swapWorkstationOperator: (layoutId: string, workstationId: string, oldOperatorId: string | null, newOperatorEmployeeId: string) => void;
  swapWorkstationMachine: (layoutId: string, workstationId: string, oldMachineId: string | null, newMachineId: string) => void;

  // Skill Matrix
  skillMatrixRecords: SkillMatrixRecord[];
  addSkillMatrixRecord: (record: Omit<SkillMatrixRecord, 'id' | 'capacityTakenDate'>) => void;
  deleteSkillMatrixRecord: (id: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Reset to default
  resetDataToFactoryDefaults: () => void;
}

const IEContext = createContext<IEContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'optisew_auth_v2',
  MOTHER_OPS: 'optisew_mother_operations_v2',
  GSD_OPS: 'optisew_gsd_operations_v2',
  STYLES: 'optisew_styles_v2',
  LAYOUTS: 'optisew_layouts_v2',
  SKILL_MATRIX: 'optisew_skill_matrix_v2',
  OPERATORS: 'optisew_operators_v2',
  MACHINES: 'optisew_machines_v2',
};

export const IEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication: default admin / 123
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; name: string } | null>(() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.AUTH) === 'true') {
        return { username: 'admin', role: 'Chief Industrial Engineer', name: 'IE Admin' };
      }
    } catch {}
    return null;
  });

  const login = (u: string, p: string): boolean => {
    if (u.trim() === 'admin' && p === '123') {
      setIsAuthenticated(true);
      const user = { username: 'admin', role: 'Chief Industrial Engineer', name: 'IE Admin' };
      setCurrentUser(user);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {}
      showToast('Welcome back, IE Admin!');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
    showToast('Logged out successfully.');
  };

  // Initialize data with local storage or mock defaults
  const [motherOperations, setMotherOperations] = useState<MotherOperation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOTHER_OPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MOTHER_OPERATIONS;
  });

  const [gsdOperations, setGsdOperations] = useState<GSDOperation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GSD_OPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GSD_OPERATIONS;
  });

  const [styles, setStyles] = useState<Style[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STYLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STYLES;
  });

  const [selectedStyleId, setSelectedStyleId] = useState<string>(styles[0]?.id || 'sty-1');

  // Operators (1000 items)
  const [operators, setOperators] = useState<Operator[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPERATORS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
      }
    } catch {}
    return generate1000Operators();
  });

  // Machines (2000 items)
  const [machines, setMachines] = useState<Machine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MACHINES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 200) return parsed;
      }
    } catch {}
    return generate2000Machines();
  });

  const [lineLayouts, setLineLayouts] = useState<LineLayout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAYOUTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LINE_LAYOUTS;
  });

  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(lineLayouts[0]?.id || 'lyt-1');

  const [skillMatrixRecords, setSkillMatrixRecords] = useState<SkillMatrixRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILL_MATRIX);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SKILL_MATRIX_RECORDS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOTHER_OPS, JSON.stringify(motherOperations));
    } catch {}
  }, [motherOperations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GSD_OPS, JSON.stringify(gsdOperations));
    } catch {}
  }, [gsdOperations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STYLES, JSON.stringify(styles));
    } catch {}
  }, [styles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(lineLayouts));
    } catch {}
  }, [lineLayouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILL_MATRIX, JSON.stringify(skillMatrixRecords));
    } catch {}
  }, [skillMatrixRecords]);

  // Toast handler
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Map employee ID lookup for O(1) performance
  const operatorMap = useMemo(() => {
    const map = new Map<string, Operator>();
    operators.forEach((op) => {
      map.set(op.employeeId, op);
      map.set(op.id, op);
    });
    return map;
  }, [operators]);

  const machineMap = useMemo(() => {
    const map = new Map<string, Machine>();
    machines.forEach((m) => {
      map.set(m.machineId, m);
      map.set(m.id, m);
    });
    return map;
  }, [machines]);

  const getOperatorByEmployeeId = (empId: string) => operatorMap.get(empId);
  const getMachineByMachineId = (machId: string) => machineMap.get(machId);

  // Mother Operation CRUD
  const addMotherOperation = (name: string, category: OperationCategory, description = '') => {
    const newOp: MotherOperation = {
      id: `mop-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setMotherOperations((prev) => [newOp, ...prev]);
    showToast(`Mother Operation "${newOp.name}" created.`);
  };

  const updateMotherOperation = (id: string, name: string, category: OperationCategory, description = '') => {
    setMotherOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, name: name.trim(), category, description: description.trim() } : op))
    );
    // Also update GSD operations reference
    setGsdOperations((prev) =>
      prev.map((g) => (g.motherOperationId === id ? { ...g, motherOperationName: name.trim(), category } : g))
    );
    showToast(`Mother Operation updated.`);
  };

  const deleteMotherOperation = (id: string) => {
    const count = gsdOperations.filter((g) => g.motherOperationId === id).length;
    if (count > 0) {
      showToast(`Cannot delete: ${count} GSD operations linked to this Mother Operation.`);
      return;
    }
    setMotherOperations((prev) => prev.filter((op) => op.id !== id));
    showToast('Mother Operation deleted.');
  };

  // GSD Operation CRUD
  const addGSDOperation = (data: Omit<GSDOperation, 'id' | 'code'>) => {
    const code = `GSD-${data.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newGSD: GSDOperation = {
      ...data,
      id: `gsd-${Date.now()}`,
      code,
      smv: Number(data.smv.toFixed(3)),
    };
    setGsdOperations((prev) => [newGSD, ...prev]);
    showToast(`GSD Operation "${newGSD.name}" added (SMV: ${newGSD.smv}).`);
  };

  const updateGSDOperation = (id: string, data: Partial<GSDOperation>) => {
    setGsdOperations((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data, smv: data.smv !== undefined ? Number(data.smv.toFixed(3)) : g.smv } : g))
    );
    showToast('GSD Operation updated.');
  };

  const deleteGSDOperation = (id: string) => {
    setGsdOperations((prev) => prev.filter((g) => g.id !== id));
    showToast('GSD Operation deleted.');
  };

  // Style CRUD & GSD Mapping
  const addStyle = (data: Omit<Style, 'id' | 'totalSmv' | 'gsdOperations' | 'createdDate'>): Style => {
    const newStyle: Style = {
      ...data,
      id: `sty-${Date.now()}`,
      totalSmv: 0,
      gsdOperations: [],
      createdDate: new Date().toISOString().split('T')[0],
    };
    setStyles((prev) => [newStyle, ...prev]);
    setSelectedStyleId(newStyle.id);
    showToast(`Style "${newStyle.styleCode}" created successfully.`);
    return newStyle;
  };

  const updateStyle = (id: string, updates: Partial<Style>) => {
    setStyles((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Style updated.');
  };

  const deleteStyle = (id: string) => {
    setStyles((prev) => prev.filter((s) => s.id !== id));
    showToast('Style deleted.');
  };

  const addOperationToStyle = (styleId: string, gsdOpId: string) => {
    const gsd = gsdOperations.find((g) => g.id === gsdOpId);
    if (!gsd) return;

    setStyles((prev) =>
      prev.map((s) => {
        if (s.id !== styleId) return s;
        const newSeq = s.gsdOperations.length + 1;
        const newMapping = {
          id: `map-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          operationId: gsd.id,
          sequence: newSeq,
          operationName: gsd.name,
          motherOperationName: gsd.motherOperationName,
          category: gsd.category,
          smv: gsd.smv,
          machineCategory: gsd.machineCategory,
        };
        const updatedList = [...s.gsdOperations, newMapping];
        const newTotalSmv = Number(updatedList.reduce((acc, curr) => acc + curr.smv, 0).toFixed(2));
        return {
          ...s,
          gsdOperations: updatedList,
          totalSmv: newTotalSmv,
        };
      })
    );
    showToast(`Added "${gsd.name}" to style operations.`);
  };

  const removeOperationFromStyle = (styleId: string, mappingId: string) => {
    setStyles((prev) =>
      prev.map((s) => {
        if (s.id !== styleId) return s;
        const filtered = s.gsdOperations.filter((m) => m.id !== mappingId);
        // Resequence
        const resequenced = filtered.map((item, idx) => ({ ...item, sequence: idx + 1 }));
        const newTotalSmv = Number(resequenced.reduce((acc, curr) => acc + curr.smv, 0).toFixed(2));
        return {
          ...s,
          gsdOperations: resequenced,
          totalSmv: newTotalSmv,
        };
      })
    );
    showToast('Operation removed from style.');
  };

  const reorderStyleOperations = (styleId: string, startIndex: number, endIndex: number) => {
    setStyles((prev) =>
      prev.map((s) => {
        if (s.id !== styleId) return s;
        const list = [...s.gsdOperations];
        const [moved] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, moved);
        const resequenced = list.map((item, idx) => ({ ...item, sequence: idx + 1 }));
        return {
          ...s,
          gsdOperations: resequenced,
        };
      })
    );
  };

  // Operator / Machine updates
  const updateOperator = (id: string, updates: Partial<Operator>) => {
    setOperators((prev) => prev.map((o) => (o.id === id || o.employeeId === id ? { ...o, ...updates } : o)));
    showToast(`Operator updated.`);
  };

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    setMachines((prev) => prev.map((m) => (m.id === id || m.machineId === id ? { ...m, ...updates } : m)));
    showToast(`Machine updated.`);
  };

  // Line Layouts
  const createLineLayout = (styleId: string, layoutName: string, lineName: string): LineLayout => {
    const style = styles.find((s) => s.id === styleId);
    if (!style) throw new Error('Style not found');

    // By default, create one workstation per operation
    const workstations: Workstation[] = style.gsdOperations.map((op, idx) => {
      // Auto assign sample operator & machine
      const sampleOp = operators[idx % operators.length]?.employeeId || 'OPR-1001';
      const sampleMach = machines[idx % machines.length]?.machineId || 'MCH-0001';

      return {
        id: `ws-${Date.now()}-${idx + 1}`,
        workstationNumber: idx + 1,
        name: `WS-${String(idx + 1).padStart(2, '0')}: ${op.operationName}`,
        operationIds: [op.operationId],
        operatorIds: [sampleOp],
        machineIds: [sampleMach],
        totalSmv: op.smv,
      };
    });

    const totalSmv = style.totalSmv || 5.0;
    const wsCount = workstations.length || 1;
    const pitchTime = Number((totalSmv / wsCount).toFixed(2));
    const targetHourly = style.targetHourlyOutput || Math.round(60 / pitchTime);

    const newLayout: LineLayout = {
      id: `lyt-${Date.now()}`,
      layoutName,
      styleId: style.id,
      styleCode: style.styleCode,
      styleName: style.styleName,
      customer: style.customer,
      lineName,
      totalOperators: wsCount,
      totalMachines: wsCount,
      totalSmv,
      pitchTime,
      targetPcsPerHour: targetHourly,
      balancingEfficiency: 85.0,
      workstations,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setLineLayouts((prev) => [newLayout, ...prev]);
    setSelectedLayoutId(newLayout.id);
    showToast(`Created Line Layout "${layoutName}".`);
    return newLayout;
  };

  const updateLineLayout = (id: string, updates: Partial<LineLayout>) => {
    setLineLayouts((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        return updated;
      })
    );
    showToast('Line layout updated.');
  };

  // Copy Line Layout
  const copyLineLayout = (sourceLayoutId: string, targetStyleId: string, newLayoutName: string): LineLayout => {
    const source = lineLayouts.find((l) => l.id === sourceLayoutId);
    const targetStyle = styles.find((s) => s.id === targetStyleId);
    if (!source || !targetStyle) throw new Error('Source layout or target style not found');

    const duplicatedWorkstations: Workstation[] = source.workstations.map((ws, i) => ({
      ...ws,
      id: `ws-copy-${Date.now()}-${i + 1}`,
      workstationNumber: i + 1,
    }));

    const newLayout: LineLayout = {
      id: `lyt-copy-${Date.now()}`,
      layoutName: newLayoutName || `Copy of ${source.layoutName}`,
      styleId: targetStyle.id,
      styleCode: targetStyle.styleCode,
      styleName: targetStyle.styleName,
      customer: targetStyle.customer,
      lineName: source.lineName,
      totalOperators: source.totalOperators,
      totalMachines: source.totalMachines,
      totalSmv: targetStyle.totalSmv || source.totalSmv,
      pitchTime: source.pitchTime,
      targetPcsPerHour: targetStyle.targetHourlyOutput || source.targetPcsPerHour,
      balancingEfficiency: source.balancingEfficiency,
      workstations: duplicatedWorkstations,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setLineLayouts((prev) => [newLayout, ...prev]);
    setSelectedLayoutId(newLayout.id);
    showToast(`Copied layout to "${newLayout.layoutName}".`);
    return newLayout;
  };

  // Group multiple operations into one workstation
  const groupOperationsIntoWorkstation = (layoutId: string, workstationId: string, operationIdsToGroup: string[]) => {
    setLineLayouts((prev) =>
      prev.map((layout) => {
        if (layout.id !== layoutId) return layout;

        const targetWs = layout.workstations.find((w) => w.id === workstationId);
        if (!targetWs) return layout;

        // Combined operations
        const mergedOpIds = Array.from(new Set([...targetWs.operationIds, ...operationIdsToGroup]));

        // Calculate combined SMV
        const combinedSmv = mergedOpIds.reduce((sum, opId) => {
          const gsd = gsdOperations.find((g) => g.id === opId);
          return sum + (gsd?.smv || 0);
        }, 0);

        // Remove the grouped operations from other workstations so no duplicates exist
        const updatedWorkstations = layout.workstations
          .map((ws) => {
            if (ws.id === workstationId) {
              return {
                ...ws,
                operationIds: mergedOpIds,
                totalSmv: Number(combinedSmv.toFixed(3)),
                name: `${ws.name} (Grouped ${mergedOpIds.length} Ops)`,
              };
            }
            // Filter out grouped ops from others
            const remainingOps = ws.operationIds.filter((id) => !operationIdsToGroup.includes(id));
            if (remainingOps.length === 0) return null; // dissolve empty workstation
            const remainingSmv = remainingOps.reduce((sum, opId) => {
              const gsd = gsdOperations.find((g) => g.id === opId);
              return sum + (gsd?.smv || 0);
            }, 0);
            return {
              ...ws,
              operationIds: remainingOps,
              totalSmv: Number(remainingSmv.toFixed(3)),
            };
          })
          .filter(Boolean) as Workstation[];

        // Re-number workstations
        const resequenced = updatedWorkstations.map((ws, idx) => ({
          ...ws,
          workstationNumber: idx + 1,
        }));

        const newPitchTime = Number((layout.totalSmv / resequenced.length).toFixed(2));

        return {
          ...layout,
          workstations: resequenced,
          pitchTime: newPitchTime,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
    showToast('Operations successfully grouped into workstation.');
  };

  // Split a grouped workstation back into individual workstations
  const splitWorkstation = (layoutId: string, workstationId: string) => {
    setLineLayouts((prev) =>
      prev.map((layout) => {
        if (layout.id !== layoutId) return layout;
        const targetWs = layout.workstations.find((w) => w.id === workstationId);
        if (!targetWs || targetWs.operationIds.length <= 1) {
          return layout;
        }

        const newWorkstations: Workstation[] = [];
        layout.workstations.forEach((ws) => {
          if (ws.id !== workstationId) {
            newWorkstations.push(ws);
          } else {
            // Split each op into its own workstation
            ws.operationIds.forEach((opId, idx) => {
              const gsd = gsdOperations.find((g) => g.id === opId);
              newWorkstations.push({
                id: `ws-split-${Date.now()}-${idx}`,
                workstationNumber: 0,
                name: `WS: ${gsd?.name || 'Split Operation'}`,
                operationIds: [opId],
                operatorIds: ws.operatorIds[idx] ? [ws.operatorIds[idx]] : [ws.operatorIds[0] || 'OPR-1001'],
                machineIds: ws.machineIds[idx] ? [ws.machineIds[idx]] : [ws.machineIds[0] || 'MCH-0001'],
                totalSmv: gsd?.smv || 0.3,
              });
            });
          }
        });

        const resequenced = newWorkstations.map((ws, idx) => ({
          ...ws,
          workstationNumber: idx + 1,
        }));

        return {
          ...layout,
          workstations: resequenced,
          pitchTime: Number((layout.totalSmv / resequenced.length).toFixed(2)),
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
    showToast('Workstation split into individual operations.');
  };

  // Swap Operator in Workstation (via Dropdown or QR Scan)
  const swapWorkstationOperator = (
    layoutId: string,
    workstationId: string,
    oldOperatorId: string | null,
    newOperatorEmployeeId: string
  ) => {
    const newOp = getOperatorByEmployeeId(newOperatorEmployeeId);
    if (!newOp) {
      showToast(`Operator ${newOperatorEmployeeId} not found in HRIS system.`);
      return;
    }

    setLineLayouts((prev) =>
      prev.map((layout) => {
        if (layout.id !== layoutId) return layout;
        const updatedWs = layout.workstations.map((ws) => {
          if (ws.id !== workstationId) return ws;
          let newOperators: string[] = [];
          if (!oldOperatorId || ws.operatorIds.length <= 1) {
            newOperators = [newOp.employeeId];
          } else {
            newOperators = ws.operatorIds.map((id) => (id === oldOperatorId ? newOp.employeeId : id));
          }
          return {
            ...ws,
            operatorIds: newOperators,
          };
        });
        return { ...layout, workstations: updatedWs, updatedAt: new Date().toISOString().split('T')[0] };
      })
    );

    showToast(`Operator mapped: ${newOp.name} (${newOp.employeeId}) [${newOp.skillGrade}]`);
  };

  // Swap Machine in Workstation
  const swapWorkstationMachine = (
    layoutId: string,
    workstationId: string,
    oldMachineId: string | null,
    newMachineId: string
  ) => {
    const newMach = getMachineByMachineId(newMachineId);
    if (!newMach) {
      showToast(`Machine ${newMachineId} not found in inventory.`);
      return;
    }

    setLineLayouts((prev) =>
      prev.map((layout) => {
        if (layout.id !== layoutId) return layout;
        const updatedWs = layout.workstations.map((ws) => {
          if (ws.id !== workstationId) return ws;
          let newMachines: string[] = [];
          if (!oldMachineId || ws.machineIds.length <= 1) {
            newMachines = [newMach.machineId];
          } else {
            newMachines = ws.machineIds.map((id) => (id === oldMachineId ? newMach.machineId : id));
          }
          return {
            ...ws,
            machineIds: newMachines,
          };
        });
        return { ...layout, workstations: updatedWs, updatedAt: new Date().toISOString().split('T')[0] };
      })
    );

    showToast(`Machine mapped: ${newMach.machineId} (${newMach.brand} ${newMach.model})`);
  };

  // Skill Matrix CRUD
  const addSkillMatrixRecord = (record: Omit<SkillMatrixRecord, 'id' | 'capacityTakenDate'>) => {
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newRecord: SkillMatrixRecord = {
      ...record,
      id: `sm-${Date.now()}`,
      capacityTakenDate: dateFormatted,
    };

    setSkillMatrixRecords((prev) => [newRecord, ...prev]);

    // Update operator's average efficiency in the 1000 operator pool
    setOperators((prev) =>
      prev.map((op) => {
        if (op.employeeId === record.operatorEmployeeId) {
          const newAvg = Number(((op.efficiencyAvg + record.efficiencyPercent) / 2).toFixed(1));
          let skillGrade = op.skillGrade;
          if (newAvg >= 90) skillGrade = 'A';
          else if (newAvg >= 75) skillGrade = 'B';
          else if (newAvg >= 60) skillGrade = 'C';
          else skillGrade = 'D';

          return {
            ...op,
            efficiencyAvg: newAvg,
            skillGrade,
          };
        }
        return op;
      })
    );

    showToast(
      `Recorded capacity study for ${newRecord.operatorName}: ${newRecord.efficiencyPercent.toFixed(1)}% efficiency!`
    );
  };

  const deleteSkillMatrixRecord = (id: string) => {
    setSkillMatrixRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Record removed from Skill Matrix.');
  };

  const resetDataToFactoryDefaults = () => {
    setMotherOperations(INITIAL_MOTHER_OPERATIONS);
    setGsdOperations(INITIAL_GSD_OPERATIONS);
    setStyles(INITIAL_STYLES);
    setLineLayouts(INITIAL_LINE_LAYOUTS);
    setSkillMatrixRecords(INITIAL_SKILL_MATRIX_RECORDS);
    setOperators(generate1000Operators());
    setMachines(generate2000Machines());
    localStorage.clear();
    showToast('Restored all master datasets to factory defaults.');
  };

  return (
    <IEContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isAuthenticated,
        currentUser,
        login,
        logout,
        motherOperations,
        addMotherOperation,
        updateMotherOperation,
        deleteMotherOperation,
        gsdOperations,
        addGSDOperation,
        updateGSDOperation,
        deleteGSDOperation,
        styles,
        selectedStyleId,
        setSelectedStyleId,
        addStyle,
        updateStyle,
        deleteStyle,
        addOperationToStyle,
        removeOperationFromStyle,
        reorderStyleOperations,
        operators,
        machines,
        updateOperator,
        updateMachine,
        getOperatorByEmployeeId,
        getMachineByMachineId,
        lineLayouts,
        selectedLayoutId,
        setSelectedLayoutId,
        createLineLayout,
        updateLineLayout,
        copyLineLayout,
        groupOperationsIntoWorkstation,
        splitWorkstation,
        swapWorkstationOperator,
        swapWorkstationMachine,
        skillMatrixRecords,
        addSkillMatrixRecord,
        deleteSkillMatrixRecord,
        toastMessage,
        showToast,
        resetDataToFactoryDefaults,
      }}
    >
      {children}
    </IEContext.Provider>
  );
};

export const useIE = () => {
  const context = useContext(IEContext);
  if (!context) {
    throw new Error('useIE must be used within an IEProvider');
  }
  return context;
};
