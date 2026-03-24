import { Card, Hand, SUITS, RANKS } from './types.js';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function dealHands(count: number): Hand[] {
  const deck = shuffle(createDeck());
  const hands: Hand[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * 5;
    hands.push(deck.slice(start, start + 5) as Hand);
  }
  return hands;
}
