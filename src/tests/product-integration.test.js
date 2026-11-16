import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { selectProducts } from '../fetch-api-practice/product-selector.js';
import {
  initialState,
  productReducer
} from '../fetch-api-practice/product-state.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);

function createState() {
  return structuredClone(initialState);
}

describe('MyStore Product Loading Integration', () => {
  it('INT-001: Starts with an empty product catalogue', () => {
    const state = createState();

    const visibleProducts = selectProducts(state.products, state.filters);

    assert.deepEqual(visibleProducts, []);
    assert.equal(state.status.isLoading, false);
    assert.equal(state.status.error, null);
  });

  it('INT-002: Loading is set to true, error to null', () => {
    const previousState = createState();

    const loadFailureAction = {
      type: 'LOAD_FAILURE',
      payload: 'Network unavailable.'
    };

    const errorState = productReducer(previousState, loadFailureAction);

    const action = {
      type: 'LOAD_START'
    };

    const nextState = productReducer(errorState, action);

    assert.equal(nextState.status.isLoading, true);
    assert.equal(nextState.status.error, null);
  });

  it('INT-003: Products are fetched successfully', async () => {
    const previousState = createState();

    const loadingState = productReducer(previousState, { type: 'LOAD_START' });

    const loadedState = productReducer(loadingState, {
      type: 'LOAD_SUCCESS',
      payload: products
    });

    assert.equal(loadedState.products.length, 14);
    assert.equal(loadedState.status.isLoading, false);

    const visibleProducts = selectProducts(
      loadedState.products,
      loadedState.filters
    );

    assert.deepEqual(visibleProducts, loadedState.products);
  });

  it('INT-004: Products are stored with loading set to false', () => {
    const previousState = createState();

    const actions = [
      {
        type: 'LOAD_START'
      },
      {
        type: 'LOAD_SUCCESS',
        payload: products
      }
    ];

    const nextState = actions.reduce(productReducer, previousState);

    assert.equal(nextState.products.length, 14);
    assert.deepEqual(
      nextState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
    assert.equal(nextState.status.isLoading, false);
  });

  it('INT-005: After loading, 14 products are displayed', async () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: await fetchTestProducts(false) }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    assert.equal(visibleProducts.length, 14);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.name),
      products.map(pdt => pdt.name)
    );
    assert.deepEqual(nextState.filters, previousState.filters);
  });

  it('INT-006: After loading, choosing Laptops category shows 3 products', () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: products },
      { type: 'SET_FILTER', payload: { key: 'category', value: 'Laptops' } }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    const expectedVisibleProducts = [
      'HP EliteBook 8 G1i Laptop',
      'Dell Pro 16 Plus Laptop',
      'Acer Aspire 14 AI Laptop'
    ];

    assert.equal(visibleProducts.length, 3);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.name),
      expectedVisibleProducts
    );
  });

  it('INT-007: After loading, selecting onSaleOnly filter matches 7 products', () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: products },
      { type: 'SET_FILTER', payload: { key: 'onSaleOnly', value: true } }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    const expectedVisibleProducts = [
      'HP EliteBook 8 G1i Laptop',
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Google Pixel Tablet',
      'HDMI Cable',
      'Samsung Galaxy Tab S12 Ultra',
      'Google Pixel 11 Pro'
    ];

    assert.equal(visibleProducts.length, 7);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.name),
      expectedVisibleProducts
    );
  });

  it('INT-008: After loading, selecting onSaleOnly and inStock filters matches 4 products', () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: products },
      { type: 'SET_FILTER', payload: { key: 'onSaleOnly', value: true } },
      { type: 'SET_FILTER', payload: { key: 'inStockOnly', value: true } }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    const expectedVisibleProducts = [
      'HP EliteBook 8 G1i Laptop',
      'Samsung Monitor',
      'Samsung Galaxy S26 Ultra',
      'Google Pixel Tablet'
    ];

    assert.equal(visibleProducts.length, 4);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.name),
      expectedVisibleProducts
    );
  });

  it('INT-009: After loading, selecting Accessories category, onSaleOnly and inStock filters matches 1 product', () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: products },
      {
        type: 'SET_FILTER',
        payload: { key: 'category', value: 'Accessories' }
      },
      { type: 'SET_FILTER', payload: { key: 'onSaleOnly', value: true } },
      { type: 'SET_FILTER', payload: { key: 'inStockOnly', value: true } }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    const expectedVisibleProducts = ['Samsung Monitor'];

    assert.equal(visibleProducts.length, 1);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.name),
      expectedVisibleProducts
    );
  });

  it('INT-010: After loading, products are sorted with price ascending', () => {
    const previousState = createState();

    const nextState = [
      { type: 'LOAD_START' },
      { type: 'LOAD_SUCCESS', payload: products },
      {
        type: 'SET_FILTER',
        payload: { key: 'sortBy', value: 'price-low' }
      }
    ].reduce(productReducer, previousState);

    const visibleProducts = selectProducts(
      nextState.products,
      nextState.filters
    );

    const prices = [
      3.99, 39, 129, 449.95, 599, 749.99, 799, 1139.59, 1199, 1199, 1199, 1529,
      1713.59, 1975.2
    ];

    assert.equal(visibleProducts.length, 14);
    assert.deepEqual(
      visibleProducts.map(pdt => pdt.price),
      prices
    );
  });

  it('INT-011: Rejection is correctly detected when fetch fails', async () => {
    await assert.rejects(fetchTestProducts(true), /Test products unavailable!/);
  });

  it('INT-012: Existing products are preserved after previous failed load', async () => {
    const previousState = createState();

    const loadSuccessAction = {
      type: 'LOAD_SUCCESS',
      payload: products
    };

    const loadedState = productReducer(previousState, loadSuccessAction);

    const loadStartAction = {
      type: 'LOAD_START'
    };

    let loadingState = productReducer(loadedState, loadStartAction);

    try {
      const products = await fetchTestProducts(true);
      loadingState = productReducer(loadingState, {
        type: 'LOAD_SUCCESS',
        payload: products
      });
    } catch (error) {
      loadingState = productReducer(loadingState, {
        type: 'LOAD_FAILURE',
        payload: error.message
      });
    }

    assert.equal(loadingState.products.length, 14);
    assert.equal(loadingState.products, loadedState.products);
    assert.equal(loadingState.status.isLoading, false);
    assert.equal(loadingState.status.error, 'Test products unavailable!');
  });

  it('INT-013: Products are displayed on successful retry after previous failure', async () => {
    let state = createState();

    state = productReducer(state, { type: 'LOAD_START' });

    try {
      await fetchTestProducts(true);
    } catch (error) {
      const loadFailureAction = {
        type: 'LOAD_FAILURE',
        payload: error.message
      };
      state = productReducer(state, loadFailureAction);
    }

    assert.equal(state.status.isLoading, false);
    assert.equal(state.status.error, 'Test products unavailable!');

    state = productReducer(state, { type: 'LOAD_START' });

    assert.equal(state.status.isLoading, true);
    assert.equal(state.status.error, null);

    const products = await fetchTestProducts(false);

    state = productReducer(state, { type: 'LOAD_SUCCESS', payload: products });

    assert.equal(state.products.length, 14);
    assert.equal(state.status.isLoading, false);
    assert.equal(state.status.error, null);
  });
});
