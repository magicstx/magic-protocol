import React, { useMemo } from 'react';
import { Text } from '../text';
import { Box, Stack } from '@nelson-ui/react';
import { Supplier, useSuppliers } from '../../common/store';
import { styled } from '@stitches/react';
import { SupplierRow, ROW_WIDTHS } from './supplier-row';
import { amountState, useSwapForm } from '../../common/hooks/use-swap-form';
import { useAtomValue } from 'jotai/utils';

export const SelectSupplier: React.FC = () => {
  const { outputToken } = useSwapForm();

  const [suppliers] = useSuppliers();

  const rows = useMemo(() => {
    return suppliers.map(supplier => {
      return <SupplierRow supplier={supplier} key={supplier.id} outputToken={outputToken} />;
    });
  }, [suppliers, outputToken]);

  const token = useMemo(() => {
    return outputToken === 'xbtc' ? 'xBTC' : 'BTC';
  }, [outputToken]);
  const inputToken = useMemo(() => {
    return outputToken === 'xbtc' ? 'BTC' : 'xBTC';
  }, [outputToken]);

  return (
    <Stack flexWrap="wrap" spacing="$4" width="1120px" minHeight="400px">
      <Box>
        <Text variant="Heading02" color="$white">
          Select your supplier
        </Text>
      </Box>
      <Box width="100%">
        <Stack flexDirection="row" py="15px" width="100%" spacing="0px">
          <Box width={`${ROW_WIDTHS[0]}px`}>
            <Text color="$text-dim" variant="Label02">
              Selected Supplier
            </Text>
          </Box>
          <Box width={`${ROW_WIDTHS[1]}px`}>
            <Text color="$text-dim" variant="Label02">
              {token} Capacity
            </Text>
          </Box>
          <Box width={`${ROW_WIDTHS[2]}px`}>
            <Text color="$text-dim" variant="Label02">
              {inputToken} -&gt; {token} Fee
            </Text>
          </Box>
          <Box width={`${ROW_WIDTHS[3]}px`}>
            <Text color="$text-dim" variant="Label02">
              {inputToken} -&gt; {token} Variable Fee
            </Text>
          </Box>
        </Stack>
        <Stack width="100%" flexDirection="column" spacing="0">
          {rows}
        </Stack>
      </Box>
    </Stack>
  );
};
