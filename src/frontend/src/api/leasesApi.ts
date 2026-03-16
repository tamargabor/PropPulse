export interface Lease {
  Id: string;
  PropertyId: string;
  TenantId: string;
  StartDate: string;         // ISO 8601 date string
  EndDate?: string | null;   // null = indefinite lease
  MonthlyRentAmount?: number | null;  // null = not yet agreed
  Status: 'Active' | 'Inactive';
}

const API_BASE = 'http://localhost:7071/api/leases';

export async function fetchLeasesByProperty(propertyId: string): Promise<Lease[]> {
  const res = await fetch(`${API_BASE}/property/${propertyId}`);
  if (!res.ok) throw new Error('Hiba a szerződések betöltésekor');
  return res.json();
}

export type NewLease = Omit<Lease, 'Id'>;

export async function createLease(data: NewLease): Promise<Lease> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba a szerződés mentésekor');
  return res.json();
}

export async function deleteLease(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Hiba a szerződés törlésekor');
}
