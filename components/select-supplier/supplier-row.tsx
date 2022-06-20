import React, { Suspense, useCallback, useMemo } from 'react';
import { Text } from '../text';
import { Box, Flex, Stack } from '@nelson-ui/react';
import { Supplier, selectedSupplierState } from '../../common/store';
import { styled } from '@stitches/react';
import { CheckSubdued } from '../icons/check-subdued';
import { bpsToPercent, satsToBtc, truncateMiddle } from '../../common/utils';
import { CheckSelected } from '../icons/check-selected';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { amountState, showOverrideSupplierState } from '../../common/hooks/use-swap-form';
import { useAutoSelectSupplier } from '../../common/hooks/use-auto-select-supplier';
import { Token } from '../swap-input';
import { useBtcBalance } from '../../common/store/api';
import { Spinner } from '../spinner';

const RowComp = styled(Box, {
  borderBottom: '1px solid $color-border-subdued',
  borderLeft: '1px solid $color-border-subdued',
  borderRight: '1px solid $color-border-subdued',
  padding: '20px 28px',
  width: '100%',
  cursor: 'pointer',
  '&:first-child': {
    borderTop: '1px solid $color-border-subdued',
    borderTopLeftRadius: '$extra-large',
    borderTopRightRadius: '$extra-large',
    // borderRadius: '$extra-large $extra-large 0 0',
  },
  '&:last-child': {
    borderBottomLeftRadius: '$extra-large',
    borderBottomRightRadius: '$extra-large',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '$color-surface-200',
      },
    },
  },
});

export const SupplierRow: React.FC<{ supplier: Supplier; outputToken: Token }> = ({
  supplier: operator,
  outputToken,
}) => {
  if (outputToken === 'btc') {
    return <OutboundSupplierRow supplier={operator} />;
  }
  return <InboundSupplierRow supplier={operator} />;
};

export const SupplierBaseRow: React.FC<{
  supplier: Supplier;
  capacity: React.ReactText | JSX.Element;
  fee: number;
  baseFee: number;
}> = ({ supplier: operator, capacity, fee: _fee, baseFee: _baseFee }) => {
  const amount = useAtomValue(amountState);
  const { supplier: selectedOp } = useAutoSelectSupplier(amount);
  const selected = selectedOp.id === operator.id;
  const color = selected ? '$color-white' : '$color-slate-90';
  const select = useAtomCallback(
    useCallback(
      (get, set) => {
        set(selectedSupplierState, operator);
        set(showOverrideSupplierState, false);
      },
      [operator]
    )
  );

  const fee = useMemo(() => {
    return bpsToPercent(_fee);
  }, [_fee]);
  const baseFee = useMemo(() => {
    return satsToBtc(_baseFee);
  }, [_baseFee]);

  return (
    <RowComp selected={selected} onClick={select}>
      <Flex flexDirection="row" alignItems="center">
        <Box width="225px" flexGrow={1}>
          <Stack spacing="16px" isInline>
            {selected ? <CheckSelected /> : <CheckSubdued />}
            <Text variant="Label02" color={color}>
              {truncateMiddle(operator.controller, 6)}
            </Text>
          </Stack>
        </Box>
        <Box width="150px">
          <Text variant="Caption02" color={color}>
            {capacity}
          </Text>
        </Box>
        <Box width="150px">
          <Text variant="Caption02" color={color}>
            {fee}%
          </Text>
        </Box>
        <Box width="150px">
          <Text variant="Caption02" color={color}>
            {baseFee}
          </Text>
        </Box>
      </Flex>
    </RowComp>
  );
};

export const OutboundCapacity: React.FC<{ publicKey: string }> = ({ publicKey }) => {
  const btcBalance = useBtcBalance(publicKey);
  const capacity = useMemo(() => {
    return satsToBtc(btcBalance);
  }, [btcBalance]);

  return <>{capacity}</>;
};

export const OutboundSupplierRow: React.FC<{ supplier: Supplier }> = ({ supplier: operator }) => {
  const Capacity = useMemo(() => {
    return (
      <Suspense fallback={<Spinner />}>
        <OutboundCapacity publicKey={operator.publicKey} />
      </Suspense>
    );
  }, [operator.publicKey]);

  return (
    <SupplierBaseRow
      fee={operator.outboundFee}
      baseFee={operator.outboundBaseFee}
      capacity={Capacity}
      supplier={operator}
    />
  );
};

export const InboundSupplierRow: React.FC<{ supplier: Supplier }> = ({ supplier: operator }) => {
  const capacity = useMemo(() => {
    return satsToBtc(operator.funds);
  }, [operator.funds]);
  return (
    <SupplierBaseRow
      fee={operator.inboundFee}
      baseFee={operator.inboundBaseFee}
      capacity={capacity}
      supplier={operator}
    />
  );
};
