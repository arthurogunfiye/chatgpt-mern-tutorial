import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  initialState,
  productReducer
} from '../fetch-api-practice/product-state.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);
const initialStateSnapshot = structuredClone(initialState);

const filterActions = [
  {
    type: 'LOAD_SUCCESS',
    payload: products
  },
  {
    type: 'SET_FILTER',
    payload: {
      key: 'searchTerm',
      value: 'sa'
    }
  },
  {
    type: 'SET_FILTER',
    payload: {
      key: 'sortBy',
      value: 'price-high'
    }
  },
  {
    type: 'SET_FILTER',
    payload: {
      key: 'inStockOnly',
      value: true
    }
  }
];

describe('productReducer()', () => {
  it('SET_FILTER should filter by specified filter', () => {
    const categoryFilterState = productReducer(initialState, {
      type: 'SET_FILTER',
      payload: {
        key: 'category',
        value: 'Laptops'
      }
    });

    assert.equal(categoryFilterState.filters.category, 'Laptops');
  });

  it('Should preserve other filters', () => {
    const categoryFilterState = productReducer(initialState, {
      type: 'SET_FILTER',
      payload: {
        key: 'category',
        value: 'Laptops'
      }
    });

    const expectedFilters = {
      ...initialState.filters,
      category: 'Laptops'
    };

    assert.deepEqual(initialStateSnapshot.filters, initialState.filters);
    assert.deepEqual(categoryFilterState.filters, expectedFilters);
  });

  it('RESET_FILTERS should restore filter defaults', () => {
    const filteredState = filterActions.reduce(productReducer, initialState);

    const filteredStateSnapshot = structuredClone(filteredState);

    const resetState = productReducer(filteredState, {
      type: 'RESET_FILTERS'
    });

    assert.deepEqual(resetState.filters, initialStateSnapshot.filters);
    assert.deepEqual(filteredState, filteredStateSnapshot);
  });

  it('reset should preserve products', () => {
    const resetState = [...filterActions, { type: 'RESET_FILTERS' }].reduce(
      productReducer,
      initialState
    );

    assert.equal(resetState.products.length, 14);
    assert.deepEqual(
      resetState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
  });

  it('LOAD_START should set loading and clear error', () => {
    const loadingState = productReducer(initialState, {
      type: 'LOAD_START'
    });

    assert.ok(loadingState.status.isLoading);
    assert.equal(loadingState.status.error, null);
  });

  it('LOAD_SUCCESS should store products and clear loading', () => {
    const loadedState = [
      { type: 'LOAD_START' },
      {
        type: 'LOAD_FAILURE',
        payload: 'Network unavailable'
      },
      {
        type: 'LOAD_SUCCESS',
        payload: products
      }
    ].reduce(productReducer, initialState);

    assert.equal(loadedState.products.length, 14);
    assert.deepEqual(
      loadedState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
    assert.equal(loadedState.status.isLoading, false);
    assert.equal(loadedState.status.error, null);
  });

  it('LOAD_FAILURE should store error and preserve products', () => {
    const loadingState = productReducer(initialState, {
      type: 'LOAD_START'
    });

    const loadedState = productReducer(loadingState, {
      type: 'LOAD_SUCCESS',
      payload: products
    });

    const errorMsg = 'Network down. Service unavailable.';

    const errorState = productReducer(loadedState, {
      type: 'LOAD_FAILURE',
      payload: errorMsg
    });

    assert.equal(errorState.status.error, errorMsg);
    assert.equal(errorState.products.length, 14);
    assert.ok(!errorState.status.isLoading);
  });

  it('Unknown action should return original state reference', () => {
    const unknownAction = productReducer(initialState, {
      type: 'UNKNOWN_ACTION',
      payload: {
        key: 'searchTerm',
        value: 'Bose'
      }
    });

    assert.equal(unknownAction, initialState);
  });

  it('Previous state should remain unchanged', () => {
    assert.deepEqual(initialState, initialStateSnapshot);
  });

  it('Nested filters should remain unchanged', () => {
    assert.deepEqual(initialState.filters, initialStateSnapshot.filters);
  });
});
