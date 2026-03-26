import { Card, Hand, Suit, Rank, SUITS, RANK_VALUES, HandRanking, EvaluatedHand } from './types.js';
import { evaluateHand } from './evaluator.js';

// Reverse lookup: numeric value -> Rank string
const VALUE_TO_RANK = new Map<number, Rank>();
for (const [rank, value] of Object.entries(RANK_VALUES)) {
  VALUE_TO_RANK.set(value, rank as Rank);
}

const ALL_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// --- Utility helpers ---

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function makeCard(value: number, suit: Suit): Card {
  return { rank: VALUE_TO_RANK.get(value)!, suit };
}

/** Pick n random distinct items from arr. */
function pickN<T>(arr: readonly T[], n: number): T[] {
  const shuffled = shuffleArray([...arr]);
  return shuffled.slice(0, n);
}

/** Pick n distinct values from ALL_VALUES, excluding any in `exclude`. */
function pickValues(n: number, exclude: number[] = []): number[] {
  const pool = ALL_VALUES.filter((v) => !exclude.includes(v));
  return pickN(pool, n);
}

/** Check if 5 sorted unique values form a straight. */
function isStraightValues(values: number[]): boolean {
  const sorted = [...values].sort((a, b) => b - a);
  if (sorted[0]! - sorted[4]! === 4) return true;
  // Wheel: A-2-3-4-5
  if (sorted[0] === 14 && sorted[1] === 5 && sorted[4] === 2) return true;
  return false;
}

/** Pick 5 distinct rank values that do NOT form a straight. */
function pickNonStraightValues(): number[] {
  for (;;) {
    const values = pickN(ALL_VALUES, 5);
    if (!isStraightValues(values)) return values;
  }
}

/** Assign n random suits, ensuring not all identical. */
function assignNonFlushSuits(n: number): Suit[] {
  const suits = Array.from({ length: n }, () => randomItem(SUITS));
  if (suits.every((s) => s === suits[0])) {
    const others = SUITS.filter((s) => s !== suits[0]);
    suits[1] = randomItem(others);
  }
  return suits;
}

// --- Per-ranking builders ---

function buildRoyalFlush(): Hand {
  const suit = randomItem(SUITS);
  const cards = [10, 11, 12, 13, 14].map((v) => makeCard(v, suit));
  return shuffleArray(cards) as Hand;
}

function buildStraightFlush(): Hand {
  const suit = randomItem(SUITS);
  // highCard 5..13 (excludes 14 which would be Royal Flush)
  const highCard = randomInt(5, 13);
  let values: number[];
  if (highCard === 5) {
    values = [14, 2, 3, 4, 5]; // wheel
  } else {
    values = [highCard - 4, highCard - 3, highCard - 2, highCard - 1, highCard];
  }
  const cards = values.map((v) => makeCard(v, suit));
  return shuffleArray(cards) as Hand;
}

function buildFourOfAKind(): Hand {
  const quadValue = randomItem(ALL_VALUES);
  const kickerValue = randomItem(ALL_VALUES.filter((v) => v !== quadValue));
  const cards: Card[] = SUITS.map((s) => makeCard(quadValue, s));
  cards.push(makeCard(kickerValue, randomItem(SUITS)));
  return shuffleArray(cards) as Hand;
}

function buildFullHouse(): Hand {
  const tripsValue = randomItem(ALL_VALUES);
  const pairValue = randomItem(ALL_VALUES.filter((v) => v !== tripsValue));
  const tripsSuits = pickN(SUITS, 3);
  const pairSuits = pickN(SUITS, 2);
  const cards: Card[] = [
    ...tripsSuits.map((s) => makeCard(tripsValue, s)),
    ...pairSuits.map((s) => makeCard(pairValue, s)),
  ];
  return shuffleArray(cards) as Hand;
}

function buildFlush(): Hand {
  const suit = randomItem(SUITS);
  const values = pickNonStraightValues();
  const cards = values.map((v) => makeCard(v, suit));
  return shuffleArray(cards) as Hand;
}

function buildStraight(): Hand {
  const highCard = randomInt(5, 14);
  let values: number[];
  if (highCard === 5) {
    values = [14, 2, 3, 4, 5];
  } else {
    values = [highCard - 4, highCard - 3, highCard - 2, highCard - 1, highCard];
  }
  const suits = assignNonFlushSuits(5);
  const cards = values.map((v, i) => makeCard(v, suits[i]!));
  return shuffleArray(cards) as Hand;
}

function buildThreeOfAKind(): Hand {
  const tripsValue = randomItem(ALL_VALUES);
  const kickers = pickValues(2, [tripsValue]);
  const tripsSuits = pickN(SUITS, 3);
  const cards: Card[] = [
    ...tripsSuits.map((s) => makeCard(tripsValue, s)),
    ...kickers.map((v) => makeCard(v, randomItem(SUITS))),
  ];
  return shuffleArray(cards) as Hand;
}

function buildTwoPair(): Hand {
  const pairValues = pickValues(2);
  const kickerValue = pickValues(1, pairValues)[0]!;
  const cards: Card[] = [
    ...pickN(SUITS, 2).map((s) => makeCard(pairValues[0]!, s)),
    ...pickN(SUITS, 2).map((s) => makeCard(pairValues[1]!, s)),
    makeCard(kickerValue, randomItem(SUITS)),
  ];
  return shuffleArray(cards) as Hand;
}

function buildOnePair(): Hand {
  const pairValue = randomItem(ALL_VALUES);
  const kickers = pickValues(3, [pairValue]);
  const pairSuits = pickN(SUITS, 2);
  const cards: Card[] = [
    ...pairSuits.map((s) => makeCard(pairValue, s)),
    ...kickers.map((v) => makeCard(v, randomItem(SUITS))),
  ];
  return shuffleArray(cards) as Hand;
}

function buildHighCard(): Hand {
  const values = pickNonStraightValues();
  const suits = assignNonFlushSuits(5);
  const cards = values.map((v, i) => makeCard(v, suits[i]!));
  return shuffleArray(cards) as Hand;
}

// --- Main entry point ---

const builders: Record<HandRanking, () => Hand> = {
  'Royal Flush': buildRoyalFlush,
  'Straight Flush': buildStraightFlush,
  'Four of a Kind': buildFourOfAKind,
  'Full House': buildFullHouse,
  'Flush': buildFlush,
  'Straight': buildStraight,
  'Three of a Kind': buildThreeOfAKind,
  'Two Pair': buildTwoPair,
  'One Pair': buildOnePair,
  'High Card': buildHighCard,
};

export function generateHand(ranking: HandRanking): EvaluatedHand {
  const hand = builders[ranking]();
  const evaluated = evaluateHand(hand);
  if (evaluated.ranking !== ranking) {
    throw new Error(
      `Generator bug: wanted ${ranking} but evaluator says ${evaluated.ranking}`
    );
  }
  return evaluated;
}
