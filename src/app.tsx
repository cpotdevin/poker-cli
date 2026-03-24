import React, { useState, useCallback } from 'react';
import { Box, useStdout } from 'ink';
import MainMenu from './screens/MainMenu.js';
import LearnMenu from './screens/LearnMenu.js';
import BestHandQuiz from './screens/HandRankingsQuiz.js';
import NameTheHandQuiz from './screens/NameTheHandQuiz.js';
import Basics from './screens/Basics.js';

export type Screen = 'main-menu' | 'learn-menu' | 'basics' | 'best-hand-quiz' | 'name-the-hand-quiz';

export default function App() {
  const [screen, setScreen] = useState<Screen>('main-menu');
  const { stdout } = useStdout();
  const rows = process.stdout.rows ?? 24;

  const navigate = useCallback((next: Screen) => {
    stdout.write('\x1B[2J\x1B[H');
    setScreen(next);
  }, [stdout]);

  let content: React.ReactNode;
  switch (screen) {
    case 'main-menu':
      content = <MainMenu key={screen} onNavigate={navigate} />;
      break;
    case 'learn-menu':
      content = <LearnMenu key={screen} onNavigate={navigate} />;
      break;
    case 'basics':
      content = <Basics key={screen} onNavigate={navigate} />;
      break;
    case 'best-hand-quiz':
      content = <BestHandQuiz key={screen} onNavigate={navigate} />;
      break;
    case 'name-the-hand-quiz':
      content = <NameTheHandQuiz key={screen} onNavigate={navigate} />;
      break;
  }

  return (
    <Box flexDirection="column" height={rows}>
      {content}
    </Box>
  );
}
