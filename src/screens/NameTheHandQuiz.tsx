import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import HandDisplay from '../components/HandDisplay.js';
import CheatSheet from '../components/CheatSheet.js';
import {
  generateNameTheHandQuestion, NameTheHandQuestion,
  generateFindTheHandQuestion, FindTheHandQuestion,
} from '../poker/quiz.js';
import { Screen } from '../app.js';

type Props = { onNavigate: (screen: Screen) => void };

type Question =
  | { type: 'name'; data: NameTheHandQuestion }
  | { type: 'find'; data: FindTheHandQuestion };

type QuizState =
  | { phase: 'answering'; question: Question; selectedIndex: number }
  | { phase: 'feedback'; question: Question; selectedIndex: number; wasCorrect: boolean };

function randomQuestion(): Question {
  if (Math.random() < 0.75) {
    return { type: 'name', data: generateNameTheHandQuestion() };
  }
  return { type: 'find', data: generateFindTheHandQuestion() };
}

function newQuestion(): QuizState {
  return { phase: 'answering', question: randomQuestion(), selectedIndex: 0 };
}

function optionCount(q: Question): number {
  return q.type === 'name' ? q.data.options.length : q.data.hands.length;
}

function correctIndex(q: Question): number {
  return q.data.correctIndex;
}

export default function NameTheHandQuiz({ onNavigate }: Props) {
  const [state, setState] = useState<QuizState>(newQuestion);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const { question, selectedIndex } = state;
  const count = optionCount(question);

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
      setState((s) => ({ ...s, selectedIndex: (s.selectedIndex - 1 + count) % count }));
    } else if (key.downArrow || input === 'j') {
      setState((s) => ({ ...s, selectedIndex: (s.selectedIndex + 1) % count }));
    } else if (key.return || input === ' ') {
      const wasCorrect = selectedIndex === correctIndex(question);
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
        <Text bold color="green">♠ Name the Hand ♠</Text>
        <Text dimColor>Score: {score.correct}/{score.total}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>↑↓ select · enter submit · c cheatsheet · x exit</Text>
      </Box>

      {showCheatSheet ? (
        <CheatSheet />
      ) : (
        <>
          {question.type === 'name' ? (
            <NameQuestionView state={state} />
          ) : (
            <FindQuestionView state={state} />
          )}
        </>
      )}
    </Box>
  );
}

function NameQuestionView({ state }: { state: QuizState }) {
  const q = state.question as { type: 'name'; data: NameTheHandQuestion };
  const { data } = q;

  return (
    <>
      <Box marginBottom={1}>
        <Text>What is this hand?</Text>
      </Box>

      <Box marginBottom={1}>
        <Text>  </Text>
        <HandDisplay hand={data.hand.hand} />
      </Box>

      <Box flexDirection="column">
        {data.options.map((option, i) => {
          const isSelected = i === state.selectedIndex;
          const isCorrect = i === data.correctIndex;
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
            <Text key={i} color={color ?? (isSelected ? 'green' : undefined)} bold={isSelected}>
              {marker}{option}
            </Text>
          );
        })}
      </Box>

      {state.phase === 'feedback' && (
        <Box marginTop={1} flexDirection="column">
          {state.wasCorrect ? (
            <Text color="green" bold>Correct!</Text>
          ) : (
            <Text color="red" bold>
              Wrong! It was a {data.hand.ranking}.
            </Text>
          )}
          <Text dimColor>Press any key for next question...</Text>
        </Box>
      )}
    </>
  );
}

function FindQuestionView({ state }: { state: QuizState }) {
  const q = state.question as { type: 'find'; data: FindTheHandQuestion };
  const { data } = q;

  return (
    <>
      <Box marginBottom={1}>
        <Text>Which hand is a </Text>
        <Text bold color="cyan">{data.ranking}</Text>
        <Text>?</Text>
      </Box>

      <Box flexDirection="column" gap={0}>
        {data.hands.map((evalHand, i) => {
          const isSelected = i === state.selectedIndex;
          const isCorrect = i === data.correctIndex;
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
                {marker}
              </Text>
              <HandDisplay
                hand={evalHand.hand}
                dimmed={state.phase === 'feedback' && !isCorrect}
              />
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
              Wrong! Hand {data.correctIndex + 1} was the {data.ranking}.
            </Text>
          )}
          <Text dimColor>Press any key for next question...</Text>
        </Box>
      )}
    </>
  );
}
