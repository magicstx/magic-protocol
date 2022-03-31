import { NextApiRequest, NextApiResponse } from 'next';
import { nodeContracts } from '../../common/api-constants';
import { contracts } from '../../common/constants';
import { fetchSupplierWithContract, Supplier } from '../../common/store';

export async function fetchAllSuppliers() {
  const bridge = contracts.bridge.contract;
  const nextId = Number(await nodeContracts().ro(bridge.getNextSupplierId()));
  const fetchSuppliers: Promise<Supplier>[] = [];
  for (let id = 0; id < nextId; id++) {
    fetchSuppliers.push(fetchSupplierWithContract(id, bridge));
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
  return res.status(200).json({ suppliers });
}
