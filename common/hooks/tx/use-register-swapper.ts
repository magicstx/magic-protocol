import { useTx } from '../use-tx';

export const useRegisterSwapper = () => {
  return useTx(
    (contracts, submit) => {
      const tx = contracts.bridge.contract.initializeSwapper();
      return submit(tx);
      // return tx.submit({});
      // return tx.submit({
      //   sponsored: true,
      // });
    },
    {}
    // { sponsored: true }
  );
};
