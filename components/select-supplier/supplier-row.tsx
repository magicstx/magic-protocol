import React, { Suspense, useCallback, useMemo } from 'react';
import { Text } from '../text';
import { Box, Flex, SpaceBetween, Stack } from '@nelson-ui/react';
import { Supplier, selectedSupplierState } from '../../common/store';
import { styled } from '@stitches/react';
import { bpsToPercent, satsToBtc, truncateMiddle } from '../../common/utils';
import { CheckSelected } from '../icons/check-selected';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { amountState, showOverrideSupplierState } from '../../common/hooks/use-swap-form';
import { useAutoSelectSupplier } from '../../common/hooks/use-auto-select-supplier';
import { Token } from '../swap-input';
import { useBtcBalance } from '../../common/store/api';
import { Spinner } from '../spinner';

const RowComp = styled(Box, {
  borderBottom: '1px solid $border-subdued',
  // borderLeft: '1px solid $border-subdued',
  // borderRight: '1px solid $border-subdued',
  padding: '34px 0',
  width: '100%',
  cursor: 'pointer',
  '.supplier-controller': {
    color: '$text-dim',
  },
  '&:first-child': {
    borderTop: '1px solid $border-subdued',
  },
  variants: {
    selected: {
      true: {
        '.supplier-controller': {
          color: '$text',
        },
      },
    },
  },
});

export const ROW_WIDTHS = [438 + 10, 98 + 149, 218, 145 + 62];

export const SupplierRow: React.FC<{ supplier: Supplier; outputToken: Token }> = ({
  supplier: operator,
  outputToken,
}) => {
  if (outputToken === 'btc') {
    return <OutboundSupplierRow supplier={operator} />;
  }
  return <InboundSupplierRow supplier={operator} />;
};

const CheckSubdued = styled(Box, {
  width: '19px',
  height: '19px',
  border: '3px solid $border-subdued',
  borderRadius: '50%',
});

export const SupplierBaseRow: React.FC<{
  supplier: Supplier;
  capacity: React.ReactText | JSX.Element;
  outputToken: string;
  fee: number;
  baseFee: number;
}> = ({ supplier, capacity, fee: _fee, baseFee, outputToken }) => {
  const amount = useAtomValue(amountState);
  const { supplier: selectedOp } = useAutoSelectSupplier(amount);
  const selected = selectedOp.id === supplier.id;
  const color = selected ? '$color-white' : '$color-slate-90';
  const select = useAtomCallback(
    useCallback(
      (get, set) => {
        set(selectedSupplierState, supplier);
        set(showOverrideSupplierState, false);
      },
      [supplier]
    )
  );

  const fee = useMemo(() => {
    return bpsToPercent(_fee);
  }, [_fee]);

  return (
    <RowComp selected={selected} onClick={select}>
      <Flex flexDirection="row" alignItems="center">
        <Box width={`${ROW_WIDTHS[0]}px`}>
          <Stack spacing="16px" isInline>
            {selected ? <CheckSelected /> : <CheckSubdued />}
            <Text variant="Label02" className="supplier-controller">
              {/* {truncateMiddle(operator.controller, 12)} */}
              {supplier.controller}
            </Text>
          </Stack>
        </Box>
        <Box width={`${ROW_WIDTHS[1]}px`}>
          <Stack spacing="$1" isInline>
            <Text variant="Label02">{capacity}</Text>
            <Text variant="Label02" color="$text-subdued">
              {outputToken.toUpperCase()}
            </Text>
          </Stack>
        </Box>
        <Box width={`${ROW_WIDTHS[2]}px`}>
          <Stack spacing="$1" isInline>
            <Text variant="Label02">{baseFee}</Text>
            <Text variant="Label02" color="$text-subdued">
              SATS
            </Text>
          </Stack>
        </Box>
        <Box width={`${ROW_WIDTHS[3]}px`}>
          <Stack spacing="0" isInline>
            <Text variant="Label02">{fee}</Text>
            <Text variant="Label02" color="$text-subdued">
              %
            </Text>
          </Stack>
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
      outputToken="BTC"
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
      outputToken="xBTC"
      fee={operator.inboundFee}
      baseFee={operator.inboundBaseFee}
      capacity={capacity}
      supplier={operator}
    />
  );
};
