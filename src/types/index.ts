export type OperationCategory = 'Basic' | 'Intermediate' | 'Advance';

export interface MotherOperation {
  id: string;
  name: string;
  category: OperationCategory;
  description: string;
  createdDate: string;
  gsdOperationCount?: number;
}

export type MachineCategory =
  | 'SNLS' // Single Needle Lock Stitch
  | 'DNLS' // Double Needle Lock Stitch
  | 'Overlock 3T'
  | 'Overlock 4T'
  | 'Overlock 5T'
  | 'Flatlock Cylinder'
  | 'Flatlock Flatbed'
  | 'Kansai Multi-Needle'
  | 'Button Hole (Auto)'
  | 'Button Attach'
  | 'Bartack'
  | 'Feed Off The Arm (FOA)'
  | 'Ironing / Press'
  | 'Manual / Trimming';

export interface GSDOperation {
  id: string;
  code: string;
  name: string;
  motherOperationId: string;
  motherOperationName: string;
  category: OperationCategory;
  smv: number; // Standard Minute Value
  machineCategory: MachineCategory;
  description?: string;
}

export interface StyleGSDMapping {
  id: string;
  operationId: string;
  sequence: number;
  operationName: string;
  motherOperationName: string;
  category: OperationCategory;
  smv: number;
  machineCategory: MachineCategory;
  notes?: string;
}

export interface Style {
  id: string;
  styleCode: string;
  styleName: string;
  customer: string;
  garmentType: string;
  season: string;
  orderQty: number;
  targetHourlyOutput: number;
  totalSmv: number; // Sum of all selected GSD operations
  gsdOperations: StyleGSDMapping[];
  createdDate: string;
}

export type SkillGrade = 'A' | 'B' | 'C' | 'D';

export interface Operator {
  id: string;
  employeeId: string; // e.g. OPR-1001
  name: string;
  designation: string;
  department: string;
  skillGrade: SkillGrade;
  isPresent: boolean;
  qrCode: string;
  joinedDate: string;
  efficiencyAvg: number;
  avatarUrl?: string;
}

export type MachineStatus = 'Operational' | 'Idle' | 'In-Maintenance' | 'Calibration Due';

export interface Machine {
  id: string;
  machineId: string; // e.g. MCH-0001
  brand: string;
  model: string;
  category: MachineCategory;
  status: MachineStatus;
  floorLine: string;
  qrCode: string;
  serialNumber: string;
  purchaseYear: number;
}

export interface Workstation {
  id: string;
  workstationNumber: number;
  name: string;
  operationIds: string[]; // mapped operations (supports grouping multiple)
  operatorIds: string[]; // mapped operator(s)
  machineIds: string[]; // mapped machine(s)
  totalSmv: number;
  pitchTimeDelta?: number; // compared to line pitch time
}

export interface LineLayout {
  id: string;
  layoutName: string;
  styleId: string;
  styleCode: string;
  styleName: string;
  customer: string;
  lineName: string;
  totalOperators: number;
  totalMachines: number;
  totalSmv: number;
  pitchTime: number; // totalSmv / workstations.length
  targetPcsPerHour: number;
  balancingEfficiency: number;
  workstations: Workstation[];
  createdAt: string;
  updatedAt: string;
}

export interface CycleLap {
  pieceNumber: number;
  cycleTimeSec: number;
  timestamp: string;
}

export interface SkillMatrixRecord {
  id: string;
  capacityTakenDate: string;
  operatorId: string;
  operatorEmployeeId: string;
  operatorName: string;
  designation: string;
  customer: string;
  styleId: string;
  styleCode: string;
  styleName: string;
  motherOperation: string;
  operationName: string;
  operationCategory: OperationCategory;
  gsdSmv: number;
  observedAvgCycleTimeSec: number;
  observedAvgCycleTimeMin: number;
  piecesStudied: number;
  efficiencyPercent: number;
  cycleLaps?: CycleLap[];
  machineId?: string;
  workstationNumber?: number;
  studyRatingPercent?: number; // default 100
}
