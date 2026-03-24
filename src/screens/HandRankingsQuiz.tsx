import React, { useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import HandDisplay from '../components/HandDisplay.js';
import CheatSheet from '../components/CheatSheet.js';
import { generateBestHandQuestion, BestHandQuestion } from '../poker/quiz.js';
import { Screen } from '../app.js';

type Props = { onNavigate: (screen: Screen) => void };

type QuizState =
  | { phase: 'answering'; question: BestHandQuestion; selectedIndex: number }
  | { phase: 'feedback'; question: BestHandQuestion; selectedIndex: number; wasCorrect: boolean };

function newQuestion(): QuizState {
  return { phase: 'answering', question: generateBestHandQuestion(), selectedIndex: 0 };
}

export default function HandRankingsQuiz({ onNavigate }: Props) {
  const [state, setState] = useState<QuizState>(newQuestion);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const { question, selectedIndex } = state;
  const handCount = question.hands.length;

  useInput((input, key) => {
    if (input === 'x') {
      onNavigate('learn-menu');
      return;
    }

    if (input === 'c') {
      setShowCheatSheet((prev) => !prev);
      return;
    }

    if (state.phase === 'feedback') {
      setState(newQuestion());
      return;
    }

    // answering phase
    if (key.upArrow || input === 'k') {
      setState((s) => ({ ...s, selectedIndex: (s.selectedIndex - 1 + handCount) % handCount }));
    } else if (key.downArrow || input === 'j') {
      setState((s) => ({ ...s, selectedIndex: (s.selectedIndex + 1) % handCount }));
    } else if (key.return || input === ' ') {
      const wasCorrect = selectedIndex === question.correctIndex;
      setScore((s) => ({
        correct: s.correct + (wasCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      setState({ phase: 'feedback', question, selectedIndex, wasCorrect });
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text bold color="green">♠ Best Hand ♠</Text>
        <Text dimColor>Score: {score.correct}/{score.total}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>↑↓ select · enter submit · c cheatsheet · x exit</Text>
      </Box>

      {showCheatSheet ? (
        <CheatSheet />
      ) : (
        <>
          <Box marginBottom={1}>
            <Text>Which hand wins?</Text>
          </Box>

          <Box flexDirection="column" gap={0}>
            {question.hands.map((evalHand, i) => {
              const isSelected = i === selectedIndex;
              const isCorrect = i === question.correctIndex;
              let marker = isSelected ? '❯ ' : '  ';
              let color: string | undefined;

              if (state.phase === 'feedback') {
                if (isCorrect) {
                  marker = '✓ ';
                  color = 'green';
                } else if (i === state.selectedIndex && !state.wasCorrect) {
                  marker = '✗ ';
                  color = 'red';
                }
              }

              return (
                <Box key={i} gap={1}>
                  <Text color={color ?? (isSelected ? 'green' : undefined)} bold={isSelected}>
                    {marker}Hand {i + 1}:
                  </Text>
                  <HandDisplay
                    hand={evalHand.hand}
                    dimmed={state.phase === 'feedback' && !isCorrect}
                  />
                  {state.phase === 'feedback' && isCorrect && (
                    <Text color="green" dimColor> ({evalHand.ranking})</Text>
                  )}
                </Box>
              );
            })}
          </Box>

          {state.phase === 'feedback' && (
            <Box marginTop={1} flexDirection="column">
              {state.wasCorrect ? (
                <Text color="green" bold>Correct!</Text>
              ) : (
                <Text color="red" bold>
                  Wrong! Hand {question.correctIndex + 1} wins with {question.hands[question.correctIndex]!.ranking}.
                </Text>
              )}
              <Text dimColor>Press any key for next question...</Text>
            </Box>
          )}
        </>
      )}

    </Box>
  );
}
