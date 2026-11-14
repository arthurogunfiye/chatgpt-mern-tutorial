import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function add(a, b) {
  return a + b;
}

describe.skip('add()', () => {
  it('returns the sum of two positive numbers', () => {
    const result = add(3, 4);
    assert.equal(result, 7);
  });

  it('returns the sum of two negative numbers', () => {
    const result = add(-5, -3);
    assert.equal(result, -8);
  });

  it('returns the sum of negative and positive numbers', () => {
    const result1 = add(-5, 3);
    const result2 = add(-3, 8);
    assert.equal(result1, -2);
    assert.equal(result2, 5);
  });

  it('calculates a discounted price', () => {
    const originalPrice = 200;
    const discount = 20;

    const result = originalPrice * (1 - discount / 100);

    assert.equal(result, 160);
  });

  /* =================
  No state mutation
====================== */

  it('updates the score without mutating state', () => {
    function updateScore(state, points) {
      return {
        ...state,
        score: state.score + points
      };
    }

    const previousState = {
      score: 10,
      player: 'Alex'
    };

    const snapshot = structuredClone(previousState);
    const nextState = updateScore(previousState, 5);

    assert.equal(nextState.score, 15);
    assert.equal(nextState.player, 'Alex');

    assert.deepEqual(previousState, snapshot);
    assert.notEqual(nextState, previousState);
  });

  /* ===================
  Testing async funcs
====================== */

  async function getGreeting() {
    return 'Hello, MyStore!';
  }

  it('returns a greeting asynchronously', async () => {
    const result = await getGreeting();

    assert.equal(result, 'Hello, MyStore!');
  });

  /* =========================
  Testing rejected promises
============================ */

  async function loadUnavailableItem() {
    throw new Error('Item unavailable');
  }

  it('rejects when the item is unavailable', async () => {
    await assert.rejects(loadUnavailableItem(), /Item unavailable/);
  });
});

/* =================
  Test data factory
==================== */

function createCustomer(overrides = {}) {
  return {
    name: 'Guest',
    membership: 'Standard',
    active: true,
    ...overrides
  };
}

const customer1 = createCustomer();

const customer2 = createCustomer({
  membership: 'Gold'
});
