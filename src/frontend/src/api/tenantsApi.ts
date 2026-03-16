export interface Tenant {
  Id?: string;
  FullName: string;
  PhoneNumber: string;
}

const API_BASE = 'http://localhost:7071/api/tenants';

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Hiba a betöltéskor');
  return res.json();
}

export async function createTenant(data: Omit<Tenant, 'Id'>): Promise<Tenant> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba mentéskor');
  return res.json();
}

export async function updateTenant(data: Tenant): Promise<Tenant> {
  const res = await fetch(`${API_BASE}/${data.Id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba módosításkor');
  return res.json();
}

export async function deleteTenant(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Hiba törléskor');
}
