import React from 'react';
import { Box, Text, useApp } from 'ink';
import Menu from '../components/Menu.js';
import { Screen } from '../app.js';

type Props = { onNavigate: (screen: Screen) => void };

const items = [
  { label: 'Learn', value: 'learn' },
  { label: 'Exit', value: 'exit' },
];

export default function MainMenu({ onNavigate }: Props) {
  const { exit } = useApp();

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="green">♠ Poker CLI ♠</Text>
      </Box>
      <Menu
        items={items}
        onSelect={(value) => {
          if (value === 'learn') onNavigate('learn-menu');
          else if (value === 'exit') exit();
        }}
      />
    </Box>
  );
}
