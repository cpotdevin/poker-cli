import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

export type MenuItem = { label: string; value: string };

type MenuProps = {
  items: MenuItem[];
  onSelect: (value: string) => void;
  isActive?: boolean;
};

export default function Menu({ items, onSelect, isActive = true }: MenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (key.downArrow || input === 'j') {
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (key.return || input === ' ') {
        onSelect(items[selectedIndex]!.value);
      }
    },
    { isActive },
  );

  return (
    <Box flexDirection="column">
      {items.map((item, index) => (
        <Text key={item.value}>
          {index === selectedIndex ? '❯ ' : '  '}
          <Text bold={index === selectedIndex} color={index === selectedIndex ? 'green' : undefined}>
            {item.label}
          </Text>
        </Text>
      ))}
    </Box>
  );
}
