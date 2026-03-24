import React from 'react';
import { Box, Text } from 'ink';

const rankings = [
  ['Royal Flush', 'A-K-Q-J-10 same suit'],
  ['Straight Flush', 'Five consecutive, same suit'],
  ['Four of a Kind', 'Four cards of same rank'],
  ['Full House', 'Three of a kind + a pair'],
  ['Flush', 'Five cards of same suit'],
  ['Straight', 'Five consecutive cards'],
  ['Three of a Kind', 'Three cards of same rank'],
  ['Two Pair', 'Two different pairs'],
  ['One Pair', 'Two cards of same rank'],
  ['High Card', 'No combination'],
] as const;

export default function CheatSheet() {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1} alignSelf="flex-start">
      <Box marginBottom={1}>
        <Text bold color="yellow">Hand Rankings Cheatsheet</Text>
      </Box>
      {rankings.map(([name, desc], i) => (
        <Text key={name}>
          <Text color="white">{String(i + 1).padStart(2, ' ')}. </Text>
          <Text bold>{name.padEnd(16, ' ')}</Text>
          <Text dimColor>{desc}</Text>
        </Text>
      ))}
    </Box>
  );
}
