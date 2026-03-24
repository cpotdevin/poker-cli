import React from 'react';
import { Box, Text } from 'ink';
import Menu from '../components/Menu.js';
import { Screen } from '../app.js';

type Props = { onNavigate: (screen: Screen) => void };

const items = [
  { label: 'Basics', value: 'basics' },
  { label: 'Name the Hand', value: 'name-the-hand' },
  { label: 'Best Hand', value: 'best-hand' },
  { label: 'Back', value: 'back' },
];

export default function LearnMenu({ onNavigate }: Props) {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="green">♠ Learn ♠</Text>
      </Box>
      <Menu
        items={items}
        onSelect={(value) => {
          if (value === 'basics') onNavigate('basics');
          else if (value === 'name-the-hand') onNavigate('name-the-hand-quiz');
          else if (value === 'best-hand') onNavigate('best-hand-quiz');
          else if (value === 'back') onNavigate('main-menu');
        }}
      />
    </Box>
  );
}
