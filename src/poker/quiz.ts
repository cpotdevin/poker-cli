import { EvaluatedHand, HAND_RANKINGS, HandRanking } from './types.js';
import { dealHands } from './deck.js';
import { evaluateHand, findBestHand, hasUniqueBest } from './evaluator.js';
import { generateHand } from './generator.js';

export type BestHandQuestion = {
  hands: EvaluatedHand[];
  correctIndex: number;
};

export function generateBestHandQuestion(): BestHandQuestion {
  const count = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5

  for (;;) {
    const rawHands = dealHands(count);
    const hands = rawHands.map(evaluateHand);
    if (hasUniqueBest(hands)) {
      return { hands, correctIndex: findBestHand(hands) };
    }
  }
}

export type NameTheHandQuestion = {
  hand: EvaluatedHand;
  options: HandRanking[];
  correctIndex: number;
};

function dealUntilRanking(target: HandRanking): EvaluatedHand {
  return generateHand(target);
}

export function generateNameTheHandQuestion(): NameTheHandQuestion {
  const target = HAND_RANKINGS[Math.floor(Math.random() * HAND_RANKINGS.length)]!;
  const hand = dealUntilRanking(target);

  const wrong = HAND_RANKINGS.filter((r) => r !== hand.ranking);
  // Pick 3 random wrong answers
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j]!, wrong[i]!];
  }
  const options = [hand.ranking, ...wrong.slice(0, 3)];
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j]!, options[i]!];
  }

  return {
    hand,
    options: options as HandRanking[],
    correctIndex: options.indexOf(hand.ranking),
  };
}

export type FindTheHandQuestion = {
  ranking: HandRanking;
  hands: EvaluatedHand[];
  correctIndex: number;
};

export function generateFindTheHandQuestion(): FindTheHandQuestion {
  const target = HAND_RANKINGS[Math.floor(Math.random() * HAND_RANKINGS.length)]!;
  const correctHand = dealUntilRanking(target);

  // Pick 3 different wrong rankings
  const wrongRankings = HAND_RANKINGS.filter((r) => r !== target);
  for (let i = wrongRankings.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongRankings[i], wrongRankings[j]] = [wrongRankings[j]!, wrongRankings[i]!];
  }
  const wrongHands = wrongRankings.slice(0, 3).map((r) => dealUntilRanking(r));

  const hands = [correctHand, ...wrongHands];
  // Shuffle hands
  for (let i = hands.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hands[i], hands[j]] = [hands[j]!, hands[i]!];
  }

  return {
    ranking: target,
    hands,
    correctIndex: hands.indexOf(correctHand),
  };
}
