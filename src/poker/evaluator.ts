import { Hand, EvaluatedHand, HandRanking, RANK_VALUES } from './types.js';

function rankValue(hand: Hand): number[] {
  return hand.map((c) => RANK_VALUES[c.rank]);
}

function isFlush(hand: Hand): boolean {
  return hand.every((c) => c.suit === hand[0].suit);
}

function isStraight(values: number[]): { straight: boolean; highCard: number } {
  const sorted = [...values].sort((a, b) => b - a);
  const unique = [...new Set(sorted)];
  if (unique.length !== 5) return { straight: false, highCard: 0 };

  // Normal straight
  if (unique[0]! - unique[4]! === 4) {
    return { straight: true, highCard: unique[0]! };
  }

  // Ace-low straight (wheel): A-2-3-4-5
  if (unique[0] === 14 && unique[1] === 5 && unique[4] === 2) {
    return { straight: true, highCard: 5 };
  }

  return { straight: false, highCard: 0 };
}

type RankGroup = { value: number; count: number };

function getRankGroups(values: number[]): RankGroup[] {
  const counts = new Map<number, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);
}

export function evaluateHand(hand: Hand): EvaluatedHand {
  const values = rankValue(hand);
  const flush = isFlush(hand);
  const { straight, highCard } = isStraight(values);
  const groups = getRankGroups(values);
  const pattern = groups.map((g) => g.count);

  let ranking: HandRanking;
  let rv: number;
  let tiebreakers: number[];

  if (flush && straight && highCard === 14) {
    ranking = 'Royal Flush';
    rv = 9;
    tiebreakers = [14];
  } else if (flush && straight) {
    ranking = 'Straight Flush';
    rv = 8;
    tiebreakers = [highCard];
  } else if (pattern[0] === 4) {
    ranking = 'Four of a Kind';
    rv = 7;
    tiebreakers = groups.map((g) => g.value);
  } else if (pattern[0] === 3 && pattern[1] === 2) {
    ranking = 'Full House';
    rv = 6;
    tiebreakers = groups.map((g) => g.value);
  } else if (flush) {
    ranking = 'Flush';
    rv = 5;
    tiebreakers = values.sort((a, b) => b - a);
  } else if (straight) {
    ranking = 'Straight';
    rv = 4;
    tiebreakers = [highCard];
  } else if (pattern[0] === 3) {
    ranking = 'Three of a Kind';
    rv = 3;
    tiebreakers = groups.map((g) => g.value);
  } else if (pattern[0] === 2 && pattern[1] === 2) {
    ranking = 'Two Pair';
    rv = 2;
    tiebreakers = groups.map((g) => g.value);
  } else if (pattern[0] === 2) {
    ranking = 'One Pair';
    rv = 1;
    tiebreakers = groups.map((g) => g.value);
  } else {
    ranking = 'High Card';
    rv = 0;
    tiebreakers = values.sort((a, b) => b - a);
  }

  return { hand, ranking, rankValue: rv, tiebreakers };
}

function compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.rankValue !== b.rankValue) return a.rankValue - b.rankValue;
  for (let i = 0; i < a.tiebreakers.length; i++) {
    const diff = (a.tiebreakers[i] ?? 0) - (b.tiebreakers[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function findBestHand(hands: EvaluatedHand[]): number {
  let bestIndex = 0;
  for (let i = 1; i < hands.length; i++) {
    if (compareHands(hands[i]!, hands[bestIndex]!) > 0) {
      bestIndex = i;
    }
  }
  return bestIndex;
}

export function hasUniqueBest(hands: EvaluatedHand[]): boolean {
  const bestIndex = findBestHand(hands);
  const best = hands[bestIndex]!;
  return hands.every((h, i) => i === bestIndex || compareHands(h, best) !== 0);
}
