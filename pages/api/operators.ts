import { NextApiRequest, NextApiResponse } from 'next';
import { nodeContracts } from '../../common/api-constants';
import { contracts } from '../../common/constants';
import { fetchOperatorWithContract, Operator } from '../../common/store';

export async function fetchAllOperators() {
  const bridge = contracts.bridge.contract;
  const nextId = Number(await nodeContracts().ro(bridge.getNextOperatorId()));
  const fetchOperators: Promise<Operator>[] = [];
  for (let id = 0; id < nextId; id++) {
    fetchOperators.push(fetchOperatorWithContract(id, bridge));
  }
  const operators = await Promise.all(fetchOperators);
  return operators;
}

export type Operators = Awaited<ReturnType<typeof fetchAllOperators>>;

export interface OperatorsApi {
  operators: Operators;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<OperatorsApi>) {
  const operators = await fetchAllOperators();
  return res.status(200).json({ operators });
}
