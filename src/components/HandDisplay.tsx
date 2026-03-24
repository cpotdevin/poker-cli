import React from 'react';
import { Box, Text } from 'ink';
import { Hand, SUIT_SYMBOLS } from '../poker/types.js';

type HandDisplayProps = {
  hand: Hand;
  dimmed?: boolean;
};

export default function HandDisplay({ hand, dimmed = false }: HandDisplayProps) {
  return (
    <Box gap={1}>
      {hand.map((card, i) => {
        const symbol = SUIT_SYMBOLS[card.suit];
        const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
        return (
          <Text key={i} dimColor={dimmed} color={isRed ? 'red' : 'black'} backgroundColor="white">
            {` ${card.rank.padStart(2, ' ')}${symbol} `}
          </Text>
        );
      })}
    </Box>
  );
}
