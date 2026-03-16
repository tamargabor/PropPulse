export interface Property {
  Id?: string;
  Title: string;
  Address: string;
}

const API_BASE = 'http://localhost:7071/api/properties';

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Hiba a betöltéskor');
  return res.json();
}

export async function createProperty(data: Omit<Property, 'Id'>): Promise<Property> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba mentéskor');
  return res.json();
}

export async function updateProperty(data: Property): Promise<Property> {
  const res = await fetch(`${API_BASE}/${data.Id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Hiba módosításkor');
  return res.json();
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Hiba törléskor');
}
