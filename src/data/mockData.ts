import {
  MotherOperation,
  GSDOperation,
  Style,
  Operator,
  Machine,
  LineLayout,
  SkillMatrixRecord,
  MachineCategory,
  SkillGrade,
  MachineStatus,
} from '../types';

export const INITIAL_MOTHER_OPERATIONS: MotherOperation[] = [
  { id: 'mop-1', name: 'Collar Preparation', category: 'Intermediate', description: 'Interlining fusing, collar band stitch, turn & press', createdDate: '2026-01-10' },
  { id: 'mop-2', name: 'Collar Attach', category: 'Advance', description: 'Collar band join with neck line and topstitch finish', createdDate: '2026-01-10' },
  { id: 'mop-3', name: 'Cuff Preparation', category: 'Intermediate', description: 'Cuff fusing, run stitch, edge fold and trim', createdDate: '2026-01-11' },
  { id: 'mop-4', name: 'Cuff Attach', category: 'Advance', description: 'Cuff join to sleeve with pleat insertion', createdDate: '2026-01-11' },
  { id: 'mop-5', name: 'Front Placket Make', category: 'Advance', description: 'Box/French placket make, interlining insert, edge stitch', createdDate: '2026-01-12' },
  { id: 'mop-6', name: 'Pocket Flap & Make', category: 'Intermediate', description: 'Flap run stitch, creasing, pocket pouch preparation', createdDate: '2026-01-12' },
  { id: 'mop-7', name: 'Pocket Attach', category: 'Advance', description: 'Chest/Back pocket pattern attach with corner bar tack', createdDate: '2026-01-13' },
  { id: 'mop-8', name: 'Shoulder Join', category: 'Basic', description: 'Front & back yoke/shoulder join with stay tape', createdDate: '2026-01-14' },
  { id: 'mop-9', name: 'Sleeve Placket (Churidar)', category: 'Advance', description: 'Sleeve slit binding or tailored tower placket make', createdDate: '2026-01-15' },
  { id: 'mop-10', name: 'Sleeve Attach', category: 'Intermediate', description: 'Armhole overlock match and sleeve insert', createdDate: '2026-01-15' },
  { id: 'mop-11', name: 'Side Seam Join', category: 'Basic', description: 'Body side seam join with care label insertion', createdDate: '2026-01-16' },
  { id: 'mop-12', name: 'Bottom Hemming', category: 'Basic', description: 'Bottom hem folding with folder gauge', createdDate: '2026-01-16' },
  { id: 'mop-13', name: 'Sleeve Hemming', category: 'Basic', description: 'Sleeve hem fold and twin needle / flatlock run', createdDate: '2026-01-17' },
  { id: 'mop-14', name: 'Button Hole', category: 'Intermediate', description: 'Computerized electronic eyelet/standard button hole', createdDate: '2026-01-18' },
  { id: 'mop-15', name: 'Button Attach', category: 'Basic', description: 'Lockstitch 4-hole / 2-hole button attach', createdDate: '2026-01-18' },
  { id: 'mop-16', name: 'Bartack Operations', category: 'Basic', description: 'Reinforcement bar tacks at stress points', createdDate: '2026-01-19' },
  { id: 'mop-17', name: 'Final Garment Pressing', category: 'Intermediate', description: 'Steam buck press, collar roll and crease set', createdDate: '2026-01-20' },
  { id: 'mop-18', name: 'Quality Inspection & Trim', category: 'Basic', description: 'Thread trimming, measurement check, audit pass', createdDate: '2026-01-20' },
  { id: 'mop-19', name: 'Waistband Attach', category: 'Advance', description: 'Denim/Trouser continuous waistband attach with folder', createdDate: '2026-01-22' },
  { id: 'mop-20', name: 'Fly Zipper Join', category: 'Advance', description: 'J-stitch front fly zipper assemble & topstitch', createdDate: '2026-01-22' },
];

export const INITIAL_GSD_OPERATIONS: GSDOperation[] = [
  // Collar
  { id: 'gsd-1', code: 'GSD-CLR-01', name: 'Collar Run Stitch with Interlining', motherOperationId: 'mop-1', motherOperationName: 'Collar Preparation', category: 'Intermediate', smv: 0.38, machineCategory: 'SNLS' },
  { id: 'gsd-2', code: 'GSD-CLR-02', name: 'Collar Point Trim & Turn', motherOperationId: 'mop-1', motherOperationName: 'Collar Preparation', category: 'Basic', smv: 0.22, machineCategory: 'Manual / Trimming' },
  { id: 'gsd-3', code: 'GSD-CLR-03', name: 'Collar Band Run Stitch & Fold', motherOperationId: 'mop-1', motherOperationName: 'Collar Preparation', category: 'Intermediate', smv: 0.42, machineCategory: 'SNLS' },
  { id: 'gsd-4', code: 'GSD-CLR-04', name: 'Collar Insert & Neck Join', motherOperationId: 'mop-2', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.72, machineCategory: 'SNLS' },
  { id: 'gsd-5', code: 'GSD-CLR-05', name: 'Collar Band Topstitch & Close', motherOperationId: 'mop-2', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.55, machineCategory: 'SNLS' },
  
  // Placket
  { id: 'gsd-6', code: 'GSD-PLK-01', name: 'Front Placket Iron Crease', motherOperationId: 'mop-5', motherOperationName: 'Front Placket Make', category: 'Basic', smv: 0.28, machineCategory: 'Ironing / Press' },
  { id: 'gsd-7', code: 'GSD-PLK-02', name: 'Attach Upper & Lower Placket', motherOperationId: 'mop-5', motherOperationName: 'Front Placket Make', category: 'Advance', smv: 0.65, machineCategory: 'SNLS' },
  { id: 'gsd-8', code: 'GSD-PLK-03', name: 'Placket Box Stitch & Edge Trim', motherOperationId: 'mop-5', motherOperationName: 'Front Placket Make', category: 'Intermediate', smv: 0.45, machineCategory: 'SNLS' },
  
  // Pocket
  { id: 'gsd-9', code: 'GSD-PCK-01', name: 'Pocket Hemming Top Edge', motherOperationId: 'mop-6', motherOperationName: 'Pocket Flap & Make', category: 'Basic', smv: 0.25, machineCategory: 'DNLS' },
  { id: 'gsd-10', code: 'GSD-PCK-02', name: 'Iron Pocket Crease with Pattern Plate', motherOperationId: 'mop-6', motherOperationName: 'Pocket Flap & Make', category: 'Basic', smv: 0.32, machineCategory: 'Ironing / Press' },
  { id: 'gsd-11', code: 'GSD-PCK-03', name: 'Chest Pocket Attach Single Needle', motherOperationId: 'mop-7', motherOperationName: 'Pocket Attach', category: 'Advance', smv: 0.62, machineCategory: 'SNLS' },
  { id: 'gsd-12', code: 'GSD-PCK-04', name: 'Back Pocket Twin Needle Topstitch', motherOperationId: 'mop-7', motherOperationName: 'Pocket Attach', category: 'Advance', smv: 0.78, machineCategory: 'DNLS' },

  // Shoulder & Sleeves
  { id: 'gsd-13', code: 'GSD-SHL-01', name: 'Shoulder Join Overlock (4-Thread)', motherOperationId: 'mop-8', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.34, machineCategory: 'Overlock 4T' },
  { id: 'gsd-14', code: 'GSD-SHL-02', name: 'Shoulder Topstitch Stay Seam', motherOperationId: 'mop-8', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.26, machineCategory: 'SNLS' },
  { id: 'gsd-15', code: 'GSD-SLV-01', name: 'Sleeve Tower Placket Run Stitch', motherOperationId: 'mop-9', motherOperationName: 'Sleeve Placket (Churidar)', category: 'Advance', smv: 0.68, machineCategory: 'SNLS' },
  { id: 'gsd-16', code: 'GSD-SLV-02', name: 'Sleeve Attach with Gathering/Armhole', motherOperationId: 'mop-10', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.58, machineCategory: 'Overlock 4T' },
  { id: 'gsd-17', code: 'GSD-SLV-03', name: 'Armhole Topstitch', motherOperationId: 'mop-10', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.39, machineCategory: 'SNLS' },

  // Side Seam & Bottom
  { id: 'gsd-18', code: 'GSD-SDS-01', name: 'Side Seam Close with Care Label', motherOperationId: 'mop-11', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.44, machineCategory: 'Overlock 4T' },
  { id: 'gsd-19', code: 'GSD-SDS-02', name: 'Side Seam Close with Safety Stitch (5T)', motherOperationId: 'mop-11', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.52, machineCategory: 'Overlock 5T' },
  { id: 'gsd-20', code: 'GSD-HEM-01', name: 'Bottom Hemming with Folder (Flatbed)', motherOperationId: 'mop-12', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.40, machineCategory: 'Flatlock Flatbed' },
  { id: 'gsd-21', code: 'GSD-HEM-02', name: 'Bottom Single Fold Lockstitch', motherOperationId: 'mop-12', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.36, machineCategory: 'SNLS' },
  { id: 'gsd-22', code: 'GSD-SLH-01', name: 'Sleeve Hemming Cylinder Bed', motherOperationId: 'mop-13', motherOperationName: 'Sleeve Hemming', category: 'Basic', smv: 0.30, machineCategory: 'Flatlock Cylinder' },

  // Button Hole & Attach & Bartack
  { id: 'gsd-23', code: 'GSD-BTN-01', name: 'Collar & Front Placket Button Hole (3 pcs)', motherOperationId: 'mop-14', motherOperationName: 'Button Hole', category: 'Intermediate', smv: 0.35, machineCategory: 'Button Hole (Auto)' },
  { id: 'gsd-24', code: 'GSD-BTN-02', name: 'Front Placket Button Attach (3 pcs)', motherOperationId: 'mop-15', motherOperationName: 'Button Attach', category: 'Basic', smv: 0.30, machineCategory: 'Button Attach' },
  { id: 'gsd-25', code: 'GSD-BAR-01', name: 'Placket Bottom & Pocket Corner Bartack', motherOperationId: 'mop-16', motherOperationName: 'Bartack Operations', category: 'Basic', smv: 0.28, machineCategory: 'Bartack' },

  // Denim & Trouser
  { id: 'gsd-26', code: 'GSD-DNM-01', name: 'Waistband Attach with Kansai Special', motherOperationId: 'mop-19', motherOperationName: 'Waistband Attach', category: 'Advance', smv: 0.85, machineCategory: 'Kansai Multi-Needle' },
  { id: 'gsd-27', code: 'GSD-DNM-02', name: 'Fly Zipper Join to Left Front', motherOperationId: 'mop-20', motherOperationName: 'Fly Zipper Join', category: 'Advance', smv: 0.64, machineCategory: 'SNLS' },
  { id: 'gsd-28', code: 'GSD-DNM-03', name: 'J-Stitch Front Fly Pattern', motherOperationId: 'mop-20', motherOperationName: 'Fly Zipper Join', category: 'Advance', smv: 0.52, machineCategory: 'DNLS' },
  { id: 'gsd-29', code: 'GSD-DNM-04', name: 'Back Inseam Feed-Off-The-Arm', motherOperationId: 'mop-11', motherOperationName: 'Side Seam Join', category: 'Advance', smv: 0.70, machineCategory: 'Feed Off The Arm (FOA)' },

  // Finishing & Quality
  { id: 'gsd-30', code: 'GSD-FIN-01', name: 'Final Garment Steam Ironing & Folding', motherOperationId: 'mop-17', motherOperationName: 'Final Garment Pressing', category: 'Intermediate', smv: 0.60, machineCategory: 'Ironing / Press' },
  { id: 'gsd-31', code: 'GSD-FIN-02', name: 'Complete Garment Trim & 100% Quality Audit', motherOperationId: 'mop-18', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
];

export const INITIAL_STYLES: Style[] = [
  {
    id: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    customer: 'Ralph Lauren',
    garmentType: 'Polo Shirt',
    season: 'SS 2026',
    orderQty: 25000,
    targetHourlyOutput: 120,
    totalSmv: 5.79,
    createdDate: '2026-02-01',
    gsdOperations: [
      { id: 'map-1', operationId: 'gsd-6', sequence: 1, operationName: 'Front Placket Iron Crease', motherOperationName: 'Front Placket Make', category: 'Basic', smv: 0.28, machineCategory: 'Ironing / Press' },
      { id: 'map-2', operationId: 'gsd-7', sequence: 2, operationName: 'Attach Upper & Lower Placket', motherOperationName: 'Front Placket Make', category: 'Advance', smv: 0.65, machineCategory: 'SNLS' },
      { id: 'map-3', operationId: 'gsd-8', sequence: 3, operationName: 'Placket Box Stitch & Edge Trim', motherOperationName: 'Front Placket Make', category: 'Intermediate', smv: 0.45, machineCategory: 'SNLS' },
      { id: 'map-4', operationId: 'gsd-13', sequence: 4, operationName: 'Shoulder Join Overlock (4-Thread)', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.34, machineCategory: 'Overlock 4T' },
      { id: 'map-5', operationId: 'gsd-4', sequence: 5, operationName: 'Collar Insert & Neck Join', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.72, machineCategory: 'SNLS' },
      { id: 'map-6', operationId: 'gsd-5', sequence: 6, operationName: 'Collar Band Topstitch & Close', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.55, machineCategory: 'SNLS' },
      { id: 'map-7', operationId: 'gsd-22', sequence: 7, operationName: 'Sleeve Hemming Cylinder Bed', motherOperationName: 'Sleeve Hemming', category: 'Basic', smv: 0.30, machineCategory: 'Flatlock Cylinder' },
      { id: 'map-8', operationId: 'gsd-16', sequence: 8, operationName: 'Sleeve Attach with Gathering/Armhole', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.58, machineCategory: 'Overlock 4T' },
      { id: 'map-9', operationId: 'gsd-18', sequence: 9, operationName: 'Side Seam Close with Care Label', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.44, machineCategory: 'Overlock 4T' },
      { id: 'map-10', operationId: 'gsd-20', sequence: 10, operationName: 'Bottom Hemming with Folder (Flatbed)', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.40, machineCategory: 'Flatlock Flatbed' },
      { id: 'map-11', operationId: 'gsd-23', sequence: 11, operationName: 'Collar & Front Placket Button Hole (3 pcs)', motherOperationName: 'Button Hole', category: 'Intermediate', smv: 0.35, machineCategory: 'Button Hole (Auto)' },
      { id: 'map-12', operationId: 'gsd-24', sequence: 12, operationName: 'Front Placket Button Attach (3 pcs)', motherOperationName: 'Button Attach', category: 'Basic', smv: 0.30, machineCategory: 'Button Attach' },
      { id: 'map-13', operationId: 'gsd-25', sequence: 13, operationName: 'Placket Bottom & Pocket Corner Bartack', motherOperationName: 'Bartack Operations', category: 'Basic', smv: 0.28, machineCategory: 'Bartack' },
      { id: 'map-14', operationId: 'gsd-31', sequence: 14, operationName: 'Complete Garment Trim & 100% Quality Audit', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
    ],
  },
  {
    id: 'sty-2',
    styleCode: 'DNM-501-RAW',
    styleName: '5-Pocket Rigid Indigo Denim Jeans',
    customer: "Levi's",
    garmentType: 'Denim Jeans',
    season: 'AW 2026',
    orderQty: 40000,
    targetHourlyOutput: 80,
    totalSmv: 5.75,
    createdDate: '2026-02-05',
    gsdOperations: [
      { id: 'map-21', operationId: 'gsd-9', sequence: 1, operationName: 'Pocket Hemming Top Edge', motherOperationName: 'Pocket Flap & Make', category: 'Basic', smv: 0.25, machineCategory: 'DNLS' },
      { id: 'map-22', operationId: 'gsd-10', sequence: 2, operationName: 'Iron Pocket Crease with Pattern Plate', motherOperationName: 'Pocket Flap & Make', category: 'Basic', smv: 0.32, machineCategory: 'Ironing / Press' },
      { id: 'map-23', operationId: 'gsd-12', sequence: 3, operationName: 'Back Pocket Twin Needle Topstitch', motherOperationName: 'Pocket Attach', category: 'Advance', smv: 0.78, machineCategory: 'DNLS' },
      { id: 'map-24', operationId: 'gsd-27', sequence: 4, operationName: 'Fly Zipper Join to Left Front', motherOperationName: 'Fly Zipper Join', category: 'Advance', smv: 0.64, machineCategory: 'SNLS' },
      { id: 'map-25', operationId: 'gsd-28', sequence: 5, operationName: 'J-Stitch Front Fly Pattern', motherOperationName: 'Fly Zipper Join', category: 'Advance', smv: 0.52, machineCategory: 'DNLS' },
      { id: 'map-26', operationId: 'gsd-29', sequence: 6, operationName: 'Back Inseam Feed-Off-The-Arm', motherOperationName: 'Side Seam Join', category: 'Advance', smv: 0.70, machineCategory: 'Feed Off The Arm (FOA)' },
      { id: 'map-27', operationId: 'gsd-19', sequence: 7, operationName: 'Side Seam Close with Safety Stitch (5T)', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.52, machineCategory: 'Overlock 5T' },
      { id: 'map-28', operationId: 'gsd-26', sequence: 8, operationName: 'Waistband Attach with Kansai Special', motherOperationName: 'Waistband Attach', category: 'Advance', smv: 0.85, machineCategory: 'Kansai Multi-Needle' },
      { id: 'map-29', operationId: 'gsd-21', sequence: 9, operationName: 'Bottom Single Fold Lockstitch', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.36, machineCategory: 'SNLS' },
      { id: 'map-30', operationId: 'gsd-25', sequence: 10, operationName: 'Placket Bottom & Pocket Corner Bartack', motherOperationName: 'Bartack Operations', category: 'Basic', smv: 0.28, machineCategory: 'Bartack' },
      { id: 'map-31', operationId: 'gsd-31', sequence: 11, operationName: 'Complete Garment Trim & 100% Quality Audit', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
    ],
  },
  {
    id: 'sty-3',
    styleCode: 'SHR-OXF-009',
    styleName: 'Slim Fit Oxford Dress Shirt',
    customer: 'Tommy Hilfiger',
    garmentType: 'Dress Shirt',
    season: 'SS 2026',
    orderQty: 18000,
    targetHourlyOutput: 95,
    totalSmv: 6.54,
    createdDate: '2026-02-10',
    gsdOperations: [
      { id: 'map-32', operationId: 'gsd-1', sequence: 1, operationName: 'Collar Run Stitch with Interlining', motherOperationName: 'Collar Preparation', category: 'Intermediate', smv: 0.38, machineCategory: 'SNLS' },
      { id: 'map-33', operationId: 'gsd-2', sequence: 2, operationName: 'Collar Point Trim & Turn', motherOperationName: 'Collar Preparation', category: 'Basic', smv: 0.22, machineCategory: 'Manual / Trimming' },
      { id: 'map-34', operationId: 'gsd-3', sequence: 3, operationName: 'Collar Band Run Stitch & Fold', motherOperationName: 'Collar Preparation', category: 'Intermediate', smv: 0.42, machineCategory: 'SNLS' },
      { id: 'map-35', operationId: 'gsd-7', sequence: 4, operationName: 'Attach Upper & Lower Placket', motherOperationName: 'Front Placket Make', category: 'Advance', smv: 0.65, machineCategory: 'SNLS' },
      { id: 'map-36', operationId: 'gsd-11', sequence: 5, operationName: 'Chest Pocket Attach Single Needle', motherOperationName: 'Pocket Attach', category: 'Advance', smv: 0.62, machineCategory: 'SNLS' },
      { id: 'map-37', operationId: 'gsd-14', sequence: 6, operationName: 'Shoulder Topstitch Stay Seam', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.26, machineCategory: 'SNLS' },
      { id: 'map-38', operationId: 'gsd-4', sequence: 7, operationName: 'Collar Insert & Neck Join', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.72, machineCategory: 'SNLS' },
      { id: 'map-39', operationId: 'gsd-5', sequence: 8, operationName: 'Collar Band Topstitch & Close', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.55, machineCategory: 'SNLS' },
      { id: 'map-40', operationId: 'gsd-15', sequence: 9, operationName: 'Sleeve Tower Placket Run Stitch', motherOperationName: 'Sleeve Placket (Churidar)', category: 'Advance', smv: 0.68, machineCategory: 'SNLS' },
      { id: 'map-41', operationId: 'gsd-16', sequence: 10, operationName: 'Sleeve Attach with Gathering/Armhole', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.58, machineCategory: 'Overlock 4T' },
      { id: 'map-42', operationId: 'gsd-18', sequence: 11, operationName: 'Side Seam Close with Care Label', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.44, machineCategory: 'Overlock 4T' },
      { id: 'map-43', operationId: 'gsd-21', sequence: 12, operationName: 'Bottom Single Fold Lockstitch', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.36, machineCategory: 'SNLS' },
      { id: 'map-44', operationId: 'gsd-23', sequence: 13, operationName: 'Collar & Front Placket Button Hole (3 pcs)', motherOperationName: 'Button Hole', category: 'Intermediate', smv: 0.35, machineCategory: 'Button Hole (Auto)' },
      { id: 'map-45', operationId: 'gsd-31', sequence: 14, operationName: 'Complete Garment Trim & 100% Quality Audit', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
    ],
  },
  {
    id: 'sty-4',
    styleCode: 'TEE-CRW-101',
    styleName: 'Essential Combed Cotton Crewneck T-Shirt',
    customer: 'Zara',
    garmentType: 'T-Shirt',
    season: 'SS 2026',
    orderQty: 60000,
    targetHourlyOutput: 210,
    totalSmv: 2.37,
    createdDate: '2026-02-14',
    gsdOperations: [
      { id: 'map-46', operationId: 'gsd-13', sequence: 1, operationName: 'Shoulder Join Overlock (4-Thread)', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.34, machineCategory: 'Overlock 4T' },
      { id: 'map-47', operationId: 'gsd-14', sequence: 2, operationName: 'Shoulder Topstitch Stay Seam', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.26, machineCategory: 'SNLS' },
      { id: 'map-48', operationId: 'gsd-22', sequence: 3, operationName: 'Sleeve Hemming Cylinder Bed', motherOperationName: 'Sleeve Hemming', category: 'Basic', smv: 0.30, machineCategory: 'Flatlock Cylinder' },
      { id: 'map-49', operationId: 'gsd-16', sequence: 4, operationName: 'Sleeve Attach with Gathering/Armhole', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.58, machineCategory: 'Overlock 4T' },
      { id: 'map-50', operationId: 'gsd-18', sequence: 5, operationName: 'Side Seam Close with Care Label', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.44, machineCategory: 'Overlock 4T' },
      { id: 'map-51', operationId: 'gsd-20', sequence: 6, operationName: 'Bottom Hemming with Folder (Flatbed)', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.40, machineCategory: 'Flatlock Flatbed' },
      { id: 'map-52', operationId: 'gsd-31', sequence: 7, operationName: 'Complete Garment Trim & 100% Quality Audit', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
    ],
  },
  {
    id: 'sty-5',
    styleCode: 'HOD-FLC-320',
    styleName: 'Heavyweight Fleece Pullover Hoodie',
    customer: 'Nike',
    garmentType: 'Hoodie',
    season: 'AW 2026',
    orderQty: 30000,
    targetHourlyOutput: 85,
    totalSmv: 6.80,
    createdDate: '2026-02-18',
    gsdOperations: [
      { id: 'map-53', operationId: 'gsd-11', sequence: 1, operationName: 'Chest Pocket Attach Single Needle', motherOperationName: 'Pocket Attach', category: 'Advance', smv: 0.62, machineCategory: 'SNLS' },
      { id: 'map-54', operationId: 'gsd-25', sequence: 2, operationName: 'Placket Bottom & Pocket Corner Bartack', motherOperationName: 'Bartack Operations', category: 'Basic', smv: 0.28, machineCategory: 'Bartack' },
      { id: 'map-55', operationId: 'gsd-13', sequence: 3, operationName: 'Shoulder Join Overlock (4-Thread)', motherOperationName: 'Shoulder Join', category: 'Basic', smv: 0.34, machineCategory: 'Overlock 4T' },
      { id: 'map-56', operationId: 'gsd-4', sequence: 4, operationName: 'Collar Insert & Neck Join', motherOperationName: 'Collar Attach', category: 'Advance', smv: 0.72, machineCategory: 'SNLS' },
      { id: 'map-57', operationId: 'gsd-16', sequence: 5, operationName: 'Sleeve Attach with Gathering/Armhole', motherOperationName: 'Sleeve Attach', category: 'Intermediate', smv: 0.58, machineCategory: 'Overlock 4T' },
      { id: 'map-58', operationId: 'gsd-18', sequence: 6, operationName: 'Side Seam Close with Care Label', motherOperationName: 'Side Seam Join', category: 'Basic', smv: 0.44, machineCategory: 'Overlock 4T' },
      { id: 'map-59', operationId: 'gsd-20', sequence: 7, operationName: 'Bottom Hemming with Folder (Flatbed)', motherOperationName: 'Bottom Hemming', category: 'Basic', smv: 0.40, machineCategory: 'Flatlock Flatbed' },
      { id: 'map-60', operationId: 'gsd-30', sequence: 8, operationName: 'Final Garment Steam Ironing & Folding', motherOperationName: 'Final Garment Pressing', category: 'Intermediate', smv: 0.60, machineCategory: 'Ironing / Press' },
      { id: 'map-61', operationId: 'gsd-31', sequence: 9, operationName: 'Complete Garment Trim & 100% Quality Audit', motherOperationName: 'Quality Inspection & Trim', category: 'Basic', smv: 0.55, machineCategory: 'Manual / Trimming' },
    ],
  },
];

// Procedural generator for 1000 HRIS Operators
const FIRST_NAMES = [
  'Fatima', 'Rohim', 'Priya', 'Anisur', 'Nguyen', 'Sunita', 'Mohammad', 'Tran', 'Shilpi', 'Kamal',
  'Nasima', 'Arif', 'Lakshmi', 'Tariq', 'Pham', 'Rupa', 'Tanvir', 'Ananya', 'Saddam', 'Le',
  'Jannatul', 'Jahangir', 'Meenakshi', 'Shahidul', 'Bui', 'Salma', 'Monir', 'Swati', 'Ziaur', 'Do',
  'Farhana', 'Habib', 'Deepa', 'Sumon', 'Ngo', 'Rubina', 'Shamim', 'Kavita', 'Mizan', 'Duong',
  'Khadija', 'Rashed', 'Geeta', 'Sujon', 'Vu', 'Parveen', 'Babul', 'Rekha', 'Hasan', 'Dinh'
];

const LAST_NAMES = [
  'Begum', 'Mia', 'Sharma', 'Rahman', 'Thi Mai', 'Das', 'Faruk', 'Van Minh', 'Akhter', 'Hossain',
  'Khatun', 'Uddin', 'Devi', 'Islam', 'Van Duc', 'Sultana', 'Chowdhury', 'Patel', 'Sikder', 'Van Long',
  'Ferdous', 'Miah', 'Kumari', 'Alom', 'Thi Huong', 'Banerjee', 'Sarker', 'Rani', 'Ahmed', 'Van Hai',
  'Jahan', 'Hawlader', 'Nair', 'Biswas', 'Thi Lan', 'Mondal', 'Khan', 'Joshi', 'Mollah', 'Van Binh',
  'Akter', 'Bhuiyan', 'Iyer', 'Halder', 'Thi Thuy', 'Barua', 'Kazi', 'Reddy', 'Gazi', 'Van Son'
];

const DESIGNATIONS = [
  'Senior Sewing Operator',
  'Sewing Operator',
  'Junior Sewing Operator',
  'Auto Machine Specialist',
  'Multi-Skilled Operator',
  'Ironer & Finisher',
  'Quality Inspector & Auditor',
  'Line Helper & Feeder',
];

const DEPARTMENTS = [
  'Sewing Section Line 01',
  'Sewing Section Line 02',
  'Sewing Section Line 03',
  'Sewing Section Line 04',
  'Sewing Section Line 05',
  'Finishing & Pressing Bay',
  'Sample Development Room',
];

export function generate1000Operators(): Operator[] {
  const operators: Operator[] = [];
  const grades: SkillGrade[] = ['A', 'B', 'C', 'D'];

  for (let i = 1; i <= 1000; i++) {
    const fn = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 13) % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const employeeId = `OPR-${1000 + i}`;
    
    // Deterministic grade distribution: ~25% A, 45% B, 20% C, 10% D
    let skillGrade: SkillGrade = 'B';
    const r = (i * 19) % 100;
    if (r < 25) skillGrade = 'A';
    else if (r < 70) skillGrade = 'B';
    else if (r < 90) skillGrade = 'C';
    else skillGrade = 'D';

    // Avg efficiency based on grade
    let efficiencyAvg = 78;
    if (skillGrade === 'A') efficiencyAvg = 92 + (i % 8);
    else if (skillGrade === 'B') efficiencyAvg = 76 + (i % 13);
    else if (skillGrade === 'C') efficiencyAvg = 62 + (i % 12);
    else efficiencyAvg = 45 + (i % 14);

    // Present rate: ~93% present, ~7% absent
    const isPresent = (i * 31) % 100 >= 7;

    const designation = DESIGNATIONS[i % DESIGNATIONS.length];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const year = 2018 + (i % 8);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');

    operators.push({
      id: `opr-id-${i}`,
      employeeId,
      name,
      designation,
      department,
      skillGrade,
      isPresent,
      qrCode: `QR-${employeeId}`,
      joinedDate: `${year}-${month}-${day}`,
      efficiencyAvg,
    });
  }

  return operators;
}

// Procedural generator for 2000 Machine Inventory
const MACHINE_BRANDS = [
  { brand: 'Juki', models: ['DDL-9000C (Direct Drive)', 'DDL-8700', 'LBH-1790AN (Auto Buttonhole)', 'LK-1900BN (Bartack)', 'MF-7923 (Flatlock)'] },
  { brand: 'Brother', models: ['S-7300A Nexio', 'KE-430FX (Direct Drive Bartack)', 'HE-800C (Electronic Hole)', 'T-8422C (Twin Needle)'] },
  { brand: 'Pegasus', models: ['M952-4T High-speed Overlock', 'M932-3T', 'EXT-5214', 'W664-01 Flatlock'] },
  { brand: 'Yamato', models: ['VG2700 Cylinder Bed', 'AZ8000G High Speed Overlock', 'FD-62G Flat Seamer'] },
  { brand: 'Siruba', models: ['747K-514M2-24 Overlock', 'C007K Flatbed Interlock', 'BT430 Bartack'] },
  { brand: 'Jack', models: ['A4E Voice Computerized Lockstitch', 'C4 Super High Speed Overlock', 'K4 Flatlock'] },
  { brand: 'Kansai Special', models: ['DLR-1508PR Waistband Multi-Needle', 'FX-4404 Flatbed'] },
  { brand: 'Dürkopp Adler', models: ['669 Heavy-duty Cylinder', '867 Eco Lockstitch'] },
  { brand: 'Veit / Silver Star', models: ['Steam Ironing Table with Vacuum & Generator'] },
];

const MACHINE_CATEGORIES: MachineCategory[] = [
  'SNLS',
  'DNLS',
  'Overlock 4T',
  'Overlock 5T',
  'Overlock 3T',
  'Flatlock Cylinder',
  'Flatlock Flatbed',
  'Kansai Multi-Needle',
  'Button Hole (Auto)',
  'Button Attach',
  'Bartack',
  'Feed Off The Arm (FOA)',
  'Ironing / Press',
  'Manual / Trimming',
];

export function generate2000Machines(): Machine[] {
  const machines: Machine[] = [];
  const statuses: MachineStatus[] = ['Operational', 'Operational', 'Operational', 'Operational', 'Operational', 'Idle', 'In-Maintenance', 'Calibration Due'];

  for (let i = 1; i <= 2000; i++) {
    const brandObj = MACHINE_BRANDS[i % MACHINE_BRANDS.length];
    const model = brandObj.models[i % brandObj.models.length];
    const machineId = `MCH-${String(i).padStart(4, '0')}`;
    
    // Pick category matching model name hints
    let category: MachineCategory = MACHINE_CATEGORIES[i % MACHINE_CATEGORIES.length];
    if (model.includes('Lockstitch') || model.includes('DDL') || model.includes('S-7300')) category = 'SNLS';
    else if (model.includes('Twin Needle') || model.includes('T-8422')) category = 'DNLS';
    else if (model.includes('Overlock') || model.includes('M952')) category = 'Overlock 4T';
    else if (model.includes('Flatlock') || model.includes('W664') || model.includes('VG2700')) category = 'Flatlock Cylinder';
    else if (model.includes('Waistband') || model.includes('DLR')) category = 'Kansai Multi-Needle';
    else if (model.includes('Buttonhole') || model.includes('LBH') || model.includes('HE-800')) category = 'Button Hole (Auto)';
    else if (model.includes('Bartack') || model.includes('LK-1900') || model.includes('KE-430')) category = 'Bartack';
    else if (model.includes('Ironing') || model.includes('Veit')) category = 'Ironing / Press';

    const status = statuses[(i * 17) % statuses.length];
    const lineNum = 1 + (i % 6);
    const floorLine = i % 10 === 0 ? 'Maintenance Workshop' : `Sewing Floor Line ${String(lineNum).padStart(2, '0')}`;
    const purchaseYear = 2017 + (i % 9);

    machines.push({
      id: `mch-id-${i}`,
      machineId,
      brand: brandObj.brand,
      model,
      category,
      status,
      floorLine,
      qrCode: `QR-${machineId}`,
      serialNumber: `SN-${brandObj.brand.slice(0, 3).toUpperCase()}-${purchaseYear}-${1000 + i}`,
      purchaseYear,
    });
  }

  return machines;
}

// Initial Line Layouts
export const INITIAL_LINE_LAYOUTS: LineLayout[] = [
  {
    id: 'lyt-1',
    layoutName: 'Line 01 - Mens Polo Shirt Balanced Layout',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    customer: 'Ralph Lauren',
    lineName: 'Sewing Line 01 (Modular)',
    totalOperators: 14,
    totalMachines: 14,
    totalSmv: 5.79,
    pitchTime: 0.41,
    targetPcsPerHour: 120,
    balancingEfficiency: 88.5,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-25',
    workstations: [
      { id: 'ws-1', workstationNumber: 1, name: 'WS-01: Front Placket Prep & Crease', operationIds: ['gsd-6'], operatorIds: ['OPR-1002'], machineIds: ['MCH-0013'], totalSmv: 0.28 },
      { id: 'ws-2', workstationNumber: 2, name: 'WS-02: Attach Placket', operationIds: ['gsd-7'], operatorIds: ['OPR-1004'], machineIds: ['MCH-0001'], totalSmv: 0.65 },
      { id: 'ws-3', workstationNumber: 3, name: 'WS-03: Placket Box Stitch & Trim', operationIds: ['gsd-8'], operatorIds: ['OPR-1007'], machineIds: ['MCH-0002'], totalSmv: 0.45 },
      { id: 'ws-4', workstationNumber: 4, name: 'WS-04: Shoulder Join (4-Thread)', operationIds: ['gsd-13'], operatorIds: ['OPR-1011'], machineIds: ['MCH-0003'], totalSmv: 0.34 },
      { id: 'ws-5', workstationNumber: 5, name: 'WS-05: Collar Insert & Neck Join', operationIds: ['gsd-4'], operatorIds: ['OPR-1015'], machineIds: ['MCH-0004'], totalSmv: 0.72 },
      { id: 'ws-6', workstationNumber: 6, name: 'WS-06: Collar Band Topstitch', operationIds: ['gsd-5'], operatorIds: ['OPR-1019'], machineIds: ['MCH-0005'], totalSmv: 0.55 },
      { id: 'ws-7', workstationNumber: 7, name: 'WS-07: Sleeve Hemming Cylinder', operationIds: ['gsd-22'], operatorIds: ['OPR-1022'], machineIds: ['MCH-0006'], totalSmv: 0.30 },
      { id: 'ws-8', workstationNumber: 8, name: 'WS-08: Sleeve Attach Armhole', operationIds: ['gsd-16'], operatorIds: ['OPR-1026'], machineIds: ['MCH-0007'], totalSmv: 0.58 },
      { id: 'ws-9', workstationNumber: 9, name: 'WS-09: Side Seam with Care Label', operationIds: ['gsd-18'], operatorIds: ['OPR-1030'], machineIds: ['MCH-0008'], totalSmv: 0.44 },
      { id: 'ws-10', workstationNumber: 10, name: 'WS-10: Bottom Hemming Flatbed', operationIds: ['gsd-20'], operatorIds: ['OPR-1033'], machineIds: ['MCH-0009'], totalSmv: 0.40 },
      { id: 'ws-11', workstationNumber: 11, name: 'WS-11: Button Hole Placket (Auto)', operationIds: ['gsd-23'], operatorIds: ['OPR-1036'], machineIds: ['MCH-0010'], totalSmv: 0.35 },
      { id: 'ws-12', workstationNumber: 12, name: 'WS-12: Button Attach Placket', operationIds: ['gsd-24'], operatorIds: ['OPR-1040'], machineIds: ['MCH-0011'], totalSmv: 0.30 },
      { id: 'ws-13', workstationNumber: 13, name: 'WS-13: Bottom Placket Bartack', operationIds: ['gsd-25'], operatorIds: ['OPR-1044'], machineIds: ['MCH-0012'], totalSmv: 0.28 },
      { id: 'ws-14', workstationNumber: 14, name: 'WS-14: Final Trim & 100% Audit', operationIds: ['gsd-31'], operatorIds: ['OPR-1048'], machineIds: ['MCH-0014'], totalSmv: 0.55 },
    ],
  },
  {
    id: 'lyt-2',
    layoutName: 'Line 02 - 5-Pocket Indigo Denim Layout',
    styleId: 'sty-2',
    styleCode: 'DNM-501-RAW',
    styleName: '5-Pocket Rigid Indigo Denim Jeans',
    customer: "Levi's",
    lineName: 'Denim Heavy Line 02',
    totalOperators: 12,
    totalMachines: 11,
    totalSmv: 5.75,
    pitchTime: 0.52,
    targetPcsPerHour: 80,
    balancingEfficiency: 86.2,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-26',
    workstations: [
      { id: 'ws-201', workstationNumber: 1, name: 'WS-01: Back Pocket Hem & Crease (Grouped)', operationIds: ['gsd-9', 'gsd-10'], operatorIds: ['OPR-1051'], machineIds: ['MCH-0021'], totalSmv: 0.57 },
      { id: 'ws-202', workstationNumber: 2, name: 'WS-02: Back Pocket Twin Needle Topstitch', operationIds: ['gsd-12'], operatorIds: ['OPR-1053'], machineIds: ['MCH-0022'], totalSmv: 0.78 },
      { id: 'ws-203', workstationNumber: 3, name: 'WS-03: Fly Zipper Join', operationIds: ['gsd-27'], operatorIds: ['OPR-1056'], machineIds: ['MCH-0023'], totalSmv: 0.64 },
      { id: 'ws-204', workstationNumber: 4, name: 'WS-04: J-Stitch Fly Pattern', operationIds: ['gsd-28'], operatorIds: ['OPR-1058'], machineIds: ['MCH-0024'], totalSmv: 0.52 },
      { id: 'ws-205', workstationNumber: 5, name: 'WS-05: Back Inseam FOA', operationIds: ['gsd-29'], operatorIds: ['OPR-1061'], machineIds: ['MCH-0025'], totalSmv: 0.70 },
      { id: 'ws-206', workstationNumber: 6, name: 'WS-06: Side Seam 5-Thread Safety', operationIds: ['gsd-19'], operatorIds: ['OPR-1064'], machineIds: ['MCH-0026'], totalSmv: 0.52 },
      { id: 'ws-207', workstationNumber: 7, name: 'WS-07: Waistband Kansai Special', operationIds: ['gsd-26'], operatorIds: ['OPR-1068'], machineIds: ['MCH-0027'], totalSmv: 0.85 },
      { id: 'ws-208', workstationNumber: 8, name: 'WS-08: Bottom Hem Lockstitch', operationIds: ['gsd-21'], operatorIds: ['OPR-1070'], machineIds: ['MCH-0028'], totalSmv: 0.36 },
      { id: 'ws-209', workstationNumber: 9, name: 'WS-09: Pocket Corner Bartack', operationIds: ['gsd-25'], operatorIds: ['OPR-1072'], machineIds: ['MCH-0029'], totalSmv: 0.28 },
      { id: 'ws-210', workstationNumber: 10, name: 'WS-10: 100% Quality Audit & Trim', operationIds: ['gsd-31'], operatorIds: ['OPR-1075'], machineIds: ['MCH-0030'], totalSmv: 0.55 },
    ],
  },
];

// Initial Skill Matrix History records
export const INITIAL_SKILL_MATRIX_RECORDS: SkillMatrixRecord[] = [
  {
    id: 'sm-1',
    capacityTakenDate: '2026-02-24 10:15',
    operatorId: 'opr-id-2',
    operatorEmployeeId: 'OPR-1002',
    operatorName: 'Rohim Mia',
    designation: 'Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Front Placket Make',
    operationName: 'Front Placket Iron Crease',
    operationCategory: 'Basic',
    gsdSmv: 0.28,
    observedAvgCycleTimeSec: 16.2,
    observedAvgCycleTimeMin: 0.27,
    piecesStudied: 5,
    efficiencyPercent: 103.7,
    machineId: 'MCH-0013',
    workstationNumber: 1,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-2',
    capacityTakenDate: '2026-02-24 11:30',
    operatorId: 'opr-id-4',
    operatorEmployeeId: 'OPR-1004',
    operatorName: 'Anisur Rahman',
    designation: 'Senior Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Front Placket Make',
    operationName: 'Attach Upper & Lower Placket',
    operationCategory: 'Advance',
    gsdSmv: 0.65,
    observedAvgCycleTimeSec: 42.5,
    observedAvgCycleTimeMin: 0.708,
    piecesStudied: 8,
    efficiencyPercent: 91.8,
    machineId: 'MCH-0001',
    workstationNumber: 2,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-3',
    capacityTakenDate: '2026-02-24 14:10',
    operatorId: 'opr-id-15',
    operatorEmployeeId: 'OPR-1015',
    operatorName: 'Pham Van Duc',
    designation: 'Auto Machine Specialist',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Collar Attach',
    operationName: 'Collar Insert & Neck Join',
    operationCategory: 'Advance',
    gsdSmv: 0.72,
    observedAvgCycleTimeSec: 46.8,
    observedAvgCycleTimeMin: 0.78,
    piecesStudied: 6,
    efficiencyPercent: 92.3,
    machineId: 'MCH-0004',
    workstationNumber: 5,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-4',
    capacityTakenDate: '2026-02-25 09:45',
    operatorId: 'opr-id-19',
    operatorEmployeeId: 'OPR-1019',
    operatorName: 'Saddam Sikder',
    designation: 'Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Collar Attach',
    operationName: 'Collar Band Topstitch & Close',
    operationCategory: 'Advance',
    gsdSmv: 0.55,
    observedAvgCycleTimeSec: 38.6,
    observedAvgCycleTimeMin: 0.643,
    piecesStudied: 7,
    efficiencyPercent: 85.5,
    machineId: 'MCH-0005',
    workstationNumber: 6,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-5',
    capacityTakenDate: '2026-02-25 11:20',
    operatorId: 'opr-id-26',
    operatorEmployeeId: 'OPR-1026',
    operatorName: 'Salma Banerjee',
    designation: 'Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Sleeve Attach',
    operationName: 'Sleeve Attach with Gathering/Armhole',
    operationCategory: 'Intermediate',
    gsdSmv: 0.58,
    observedAvgCycleTimeSec: 46.4,
    observedAvgCycleTimeMin: 0.773,
    piecesStudied: 6,
    efficiencyPercent: 75.0,
    machineId: 'MCH-0007',
    workstationNumber: 8,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-6',
    capacityTakenDate: '2026-02-25 14:00',
    operatorId: 'opr-id-33',
    operatorEmployeeId: 'OPR-1033',
    operatorName: 'Deepa Nair',
    designation: 'Junior Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Bottom Hemming',
    operationName: 'Bottom Hemming with Folder (Flatbed)',
    operationCategory: 'Basic',
    gsdSmv: 0.40,
    observedAvgCycleTimeSec: 36.4,
    observedAvgCycleTimeMin: 0.606,
    piecesStudied: 10,
    efficiencyPercent: 66.0,
    machineId: 'MCH-0009',
    workstationNumber: 10,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-7',
    capacityTakenDate: '2026-02-26 10:00',
    operatorId: 'opr-id-53',
    operatorEmployeeId: 'OPR-1053',
    operatorName: 'Meenakshi Kumari',
    designation: 'Senior Sewing Operator',
    customer: "Levi's",
    styleId: 'sty-2',
    styleCode: 'DNM-501-RAW',
    styleName: '5-Pocket Rigid Indigo Denim Jeans',
    motherOperation: 'Pocket Attach',
    operationName: 'Back Pocket Twin Needle Topstitch',
    operationCategory: 'Advance',
    gsdSmv: 0.78,
    observedAvgCycleTimeSec: 49.2,
    observedAvgCycleTimeMin: 0.82,
    piecesStudied: 5,
    efficiencyPercent: 95.1,
    machineId: 'MCH-0022',
    workstationNumber: 2,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-8',
    capacityTakenDate: '2026-02-26 11:45',
    operatorId: 'opr-id-68',
    operatorEmployeeId: 'OPR-1068',
    operatorName: 'Mizan Mollah',
    designation: 'Auto Machine Specialist',
    customer: "Levi's",
    styleId: 'sty-2',
    styleCode: 'DNM-501-RAW',
    styleName: '5-Pocket Rigid Indigo Denim Jeans',
    motherOperation: 'Waistband Attach',
    operationName: 'Waistband Attach with Kansai Special',
    operationCategory: 'Advance',
    gsdSmv: 0.85,
    observedAvgCycleTimeSec: 54.2,
    observedAvgCycleTimeMin: 0.903,
    piecesStudied: 6,
    efficiencyPercent: 94.1,
    machineId: 'MCH-0027',
    workstationNumber: 7,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-9',
    capacityTakenDate: '2026-02-26 15:30',
    operatorId: 'opr-id-11',
    operatorEmployeeId: 'OPR-1011',
    operatorName: 'Nasima Khatun',
    designation: 'Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Shoulder Join',
    operationName: 'Shoulder Join Overlock (4-Thread)',
    operationCategory: 'Basic',
    gsdSmv: 0.34,
    observedAvgCycleTimeSec: 21.5,
    observedAvgCycleTimeMin: 0.358,
    piecesStudied: 8,
    efficiencyPercent: 95.0,
    machineId: 'MCH-0003',
    workstationNumber: 4,
    studyRatingPercent: 100,
  },
  {
    id: 'sm-10',
    capacityTakenDate: '2026-02-27 09:15',
    operatorId: 'opr-id-44',
    operatorEmployeeId: 'OPR-1044',
    operatorName: 'Sujon Halder',
    designation: 'Sewing Operator',
    customer: 'Ralph Lauren',
    styleId: 'sty-1',
    styleCode: 'POLO-2026-CL',
    styleName: 'Mens Classic Pique Polo Shirt',
    motherOperation: 'Bartack Operations',
    operationName: 'Placket Bottom & Pocket Corner Bartack',
    operationCategory: 'Basic',
    gsdSmv: 0.28,
    observedAvgCycleTimeSec: 18.0,
    observedAvgCycleTimeMin: 0.30,
    piecesStudied: 12,
    efficiencyPercent: 93.3,
    machineId: 'MCH-0012',
    workstationNumber: 13,
    studyRatingPercent: 100,
  },
];
