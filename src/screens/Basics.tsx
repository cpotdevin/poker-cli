import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../app.js';

type Props = { onNavigate: (screen: Screen) => void };

const pages = [
  {
    title: 'Ranks',
    content: [
      'A rank is the value of a card.',
      '',
      'There are 13 ranks in a standard deck:',
      '2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A',
      '',
      'Number cards (2-10) are worth their face value.',
      'Jack (J), Queen (Q), and King (K) are face cards.',
      'Ace (A) can be the highest or lowest card.',
    ],
  },
  {
    title: 'Suits',
    content: [
      'A suit is the symbol on a card.',
      '',
      'There are 4 suits in a standard deck:',
      '♠ Spades    ♣ Clubs',
      '♥ Hearts    ♦ Diamonds',
      '',
      'Spades and Clubs are black.',
      'Hearts and Diamonds are red.',
      '',
      'Suits are equal when ranking hands.',
      '',
      'When a tiebreaker is needed, the common order is:',
      '♠ Spades > ♥ Hearts > ♦ Diamonds > ♣ Clubs',
    ],
  },
  {
    title: 'Hands',
    content: [
      'A hand is a set of 5 cards.',
      '',
      'Each player is dealt cards and tries to',
      'make the best possible 5-card combination.',
      '',
      'Hands are ranked from highest to lowest.',
      'The player with the best hand wins the pot.',
    ],
  },
  {
    title: 'Hand Rankings',
    content: [
      'From best to worst:',
      '',
      ' 1. Royal Flush       A-K-Q-J-10 same suit',
      ' 2. Straight Flush    Five consecutive, same suit',
      ' 3. Four of a Kind    Four cards of same rank',
      ' 4. Full House        Three of a kind + a pair',
      ' 5. Flush             Five cards of same suit',
      ' 6. Straight          Five consecutive cards',
      ' 7. Three of a Kind   Three cards of same rank',
      ' 8. Two Pair          Two different pairs',
      ' 9. One Pair          Two cards of same rank',
      '10. High Card         No combination',
    ],
  },
] as const;

export default function Basics({ onNavigate }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex]!;

  useInput((input, key) => {
    if (input === 'x') {
      onNavigate('learn-menu');
      return;
    }
    if (key.downArrow || input === 'j' || key.return || input === ' ') {
      setPageIndex((i) => (i + 1) % pages.length);
    } else if (key.upArrow || input === 'k') {
      setPageIndex((i) => (i - 1 + pages.length) % pages.length);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text bold color="green">♠ Basics ♠</Text>
        <Text dimColor>{pageIndex + 1}/{pages.length}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>↑↓ navigate · x exit</Text>
      </Box>

      <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1} alignSelf="flex-start">
        <Box marginBottom={1}>
          <Text bold color="cyan">{page.title}</Text>
        </Box>
        {page.content.map((line, i) => (
          <Text key={i}>{line || ' '}</Text>
        ))}
      </Box>
    </Box>
  );
}
