import type { NextApiRequest, NextApiResponse } from 'next';
import { nodeContracts } from '../../common/api-constants';
import { bridgeContract } from '../../common/contracts';
import { fetchSupplierWithCapacity } from '../../common/api/electrum';
import type { SupplierWithCapacity } from '../../common/store/api';

export async function fetchAllSuppliers() {
  const bridge = bridgeContract();
  const nextId = Number(await nodeContracts().ro(bridge.getNextSupplierId()));
  const fetchSuppliers: Promise<SupplierWithCapacity>[] = [];
  for (let id = 0; id < nextId; id++) {
    fetchSuppliers.push(fetchSupplierWithCapacity(id));
  }
  const suppliers = await Promise.all(fetchSuppliers);
  return suppliers;
}

export type Suppliers = Awaited<ReturnType<typeof fetchAllSuppliers>>;

export interface SuppliersApi {
  suppliers: Suppliers;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuppliersApi>) {
  const suppliers = await fetchAllSuppliers();
  res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
  return res.status(200).json({ suppliers });
}
