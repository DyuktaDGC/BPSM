export const VEHICLES = ['walk', 'bike', 'moto', 'car', 'f1', 'plane', 'rocket'] as const;
export type Vehicle = (typeof VEHICLES)[number] | 'chute';