export type WarehouseCode = 'V1' | 'V2' | 'M1';
export interface Printer { name: string; ip: string; }

// helper to generate ETQ lists (12 per site by default)
const makeEtq = (label: string, subnet: string, count = 12, startHost = 201): Printer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `${label} - ETQ${i + 1}`,
    ip: `${subnet}.${startHost + i}`,
  }));

// helper to generate ZBR lists (70 per site by default) – used by Packing List 142
const makeZbr = (label: string, subnet: string, count = 70, startHost = 101): Printer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `${label} - ZBR${i + 1}`,
    ip: `${subnet}.${startHost + i}`,
  }));

export const SMALL_BY_WAREHOUSE: Record<WarehouseCode, Printer[]> = {
  V1: makeEtq('V1 - Printer', '192.168.70'),
  V2: makeEtq('V2 - Printer', '192.168.41'),
  M1: makeEtq('M1 - Printer', '192.168.170'),
};

export const BIG_BY_WAREHOUSE: Record<WarehouseCode, Printer[]> = {
  V1: makeZbr('V1 - Printer', '192.168.70'),
  V2: makeZbr('V2 - Printer', '192.168.41'),
  M1: makeZbr('M1 - Printer', '192.168.170'),
};
