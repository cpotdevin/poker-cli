import { describe, it, expect } from 'vitest';
import { generateHand } from './generator.js';
import { evaluateHand } from './evaluator.js';
import { HAND_RANKINGS, HandRanking } from './types.js';

const ITERATIONS = 50;

describe('generateHand', () => {
  for (const ranking of HAND_RANKINGS) {
    describe(ranking, () => {
      it(`produces a valid ${ranking} on every call`, () => {
        for (let i = 0; i < ITERATIONS; i++) {
          const result = generateHand(ranking);
          expect(result.ranking).toBe(ranking);
          // Double-check with evaluator
          const reeval = evaluateHand(result.hand);
          expect(reeval.ranking).toBe(ranking);
        }
      });

      it('returns exactly 5 unique cards', () => {
        for (let i = 0; i < ITERATIONS; i++) {
          const { hand } = generateHand(ranking);
          expect(hand).toHaveLength(5);
          const keys = hand.map((c) => `${c.rank}-${c.suit}`);
          expect(new Set(keys).size).toBe(5);
        }
      });
    });
  }

  describe('Royal Flush specifics', () => {
    it('always contains 10, J, Q, K, A of one suit', () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const { hand } = generateHand('Royal Flush');
        const suits = new Set(hand.map((c) => c.suit));
        expect(suits.size).toBe(1);
        const ranks = hand.map((c) => c.rank).sort();
        expect(ranks).toEqual(['10', 'A', 'J', 'K', 'Q']);
      }
    });
  });

  describe('Straight Flush specifics', () => {
    it('is never a Royal Flush', () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const result = generateHand('Straight Flush');
        expect(result.ranking).toBe('Straight Flush');
        expect(result.ranking).not.toBe('Royal Flush');
      }
    });
  });

  describe('Flush specifics', () => {
    it('is never a straight', () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const result = generateHand('Flush');
        expect(result.ranking).toBe('Flush');
      }
    });
  });

  describe('Straight specifics', () => {
    it('is never a flush', () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const result = generateHand('Straight');
        const suits = new Set(result.hand.map((c) => c.suit));
        expect(suits.size).toBeGreaterThan(1);
      }
    });
  });

  describe('High Card specifics', () => {
    it('has no pairs and is not a straight or flush', () => {
      for (let i = 0; i < ITERATIONS; i++) {
        const result = generateHand('High Card');
        expect(result.ranking).toBe('High Card');
        // All ranks unique
        const ranks = result.hand.map((c) => c.rank);
        expect(new Set(ranks).size).toBe(5);
        // Not all same suit
        const suits = new Set(result.hand.map((c) => c.suit));
        expect(suits.size).toBeGreaterThan(1);
      }
    });
  });
});
