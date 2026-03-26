export interface Utility {
  Id: string;
  PropertyId: string;
  Type: string;            // e.g. Víz, Villany, Közös költség
  Amount: number;
  ServiceMonth: number;
  DueDate: string;         // ISO 8601
  IsPaid: boolean;
  LeaseId?: string | null;
}

export type NewUtility = Omit<Utility, 'Id'>;

const API_BASE = 'http://localhost:7071/api/overheads';

export async function fetchUtilitiesByProperty(propertyId: string): Promise<Utility[]> {
  const res = await fetch(`${API_BASE}/property/${propertyId}`);
  if (!res.ok) throw new Error('Hiba a rezsi tételek betöltésekor');
  return res.json();
}

export async function createUtility(data: NewUtility): Promise<Utility> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba a rezsiszámla mentésekor');
  return res.json();
}

export async function deleteUtility(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Hiba a rezsiszámla törlésekor');
}

