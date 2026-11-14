import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fetchTestProducts } from '../js/test-products.js';

describe('fetchTestProducts()', () => {
  it('fetchTestProducts(false) should return products array', async () => {
    const products = await fetchTestProducts(false);
    assert.equal(products.length, 14);
  });

  it('fetchTestProducts(true) should reject with error message', async () => {
    await assert.rejects(fetchTestProducts(true), /Test products unavailable!/);
  });

  it('fetchTestProducts(false) should take at least 1000ms', async () => {
    const start = performance.now();
    const products = await fetchTestProducts(false);
    const elapsed = performance.now() - start;
    assert.ok(elapsed > 950);
  });
});
