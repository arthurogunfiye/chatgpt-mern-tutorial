import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  initialState,
  productReducer
} from '../fetch-api-practice/product-state.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);
const initialStateSnapshot = structuredClone(initialState);

function createState(overrides = {}) {
  const freshState = structuredClone(initialState);

  return {
    ...freshState,
    ...overrides,
    filters: {
      ...freshState.filters,
      ...overrides.filters
    },
    status: {
      ...freshState.status,
      ...overrides.status
    }
  };
}

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
    const previousState = createState();

    const action = {
      type: 'SET_FILTER',
      payload: {
        key: 'category',
        value: 'Laptops'
      }
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.filters.category, 'Laptops');
  });

  it('Should preserve other filters', () => {
    const previousState = createState({
      filters: {
        searchTerm: 'Samsung',
        inStockOnly: true
      }
    });

    const action = {
      type: 'SET_FILTER',
      payload: {
        key: 'category',
        value: 'Laptops'
      }
    };

    const previousFiltersSnapshot = structuredClone(previousState.filters);

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.filters.category, 'Laptops');
    assert.equal(nextState.filters.searchTerm, 'Samsung');
    assert.equal(nextState.filters.inStockOnly, true);
    assert.deepEqual(previousState.filters, previousFiltersSnapshot);
  });

  it('RESET_FILTERS should restore filter defaults', () => {
    const filteredState = filterActions.reduce(productReducer, createState());

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
      createState()
    );

    assert.equal(resetState.products.length, 14);
    assert.deepEqual(
      resetState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
  });

  it('LOAD_START should set loading and clear error', () => {
    const previousState = createState({
      status: {
        isLoading: false,
        error: 'Previous network failure'
      }
    });

    const action = {
      type: 'LOAD_START'
    };

    const nextState = productReducer(previousState, action);

    assert.ok(nextState.status.isLoading);
    assert.equal(nextState.status.error, null);
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
    ].reduce(productReducer, createState());

    assert.equal(loadedState.products.length, 14);
    assert.deepEqual(
      loadedState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
    assert.equal(loadedState.status.isLoading, false);
    assert.equal(loadedState.status.error, null);
  });

  it('LOAD_FAILURE should store error and preserve products', () => {
    const loadedState = productReducer(createState(), {
      type: 'LOAD_SUCCESS',
      payload: products
    });

    const loadingState = productReducer(loadedState, {
      type: 'LOAD_START'
    });

    const errorMsg = 'Network down. Service unavailable.';

    const errorState = productReducer(loadingState, {
      type: 'LOAD_FAILURE',
      payload: errorMsg
    });

    assert.equal(errorState.status.error, errorMsg);
    assert.equal(errorState.products.length, 14);
    assert.ok(!errorState.status.isLoading);
  });

  it('Unknown action should return original state reference', () => {
    const previousState = createState();

    const action = {
      type: 'UNKNOWN_ACTION'
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState, previousState);
  });

  it('Previous state should remain unchanged', () => {
    const previousState = createState({
      filters: {
        category: 'Laptops'
      }
    });

    const prevStateSnapshot = structuredClone(previousState);

    const action = {
      type: 'SET_FILTER',
      payload: {
        key: 'category',
        value: 'Tablets'
      }
    };

    const nextState = productReducer(previousState, action);

    assert.deepEqual(previousState, prevStateSnapshot);
    assert.equal(nextState.filters.category, 'Tablets');
    assert.notEqual(nextState, previousState);
  });

  it('Nested filters should remain unchanged', () => {
    const previousState = createState();

    const previousFilters = previousState.filters;

    const previousFiltersSnapshot = structuredClone(previousFilters);

    const action = {
      type: 'SET_FILTER',
      payload: {
        key: 'onSaleOnly',
        value: true
      }
    };

    const nextState = productReducer(previousFilters, action);

    assert.deepEqual(previousFilters, previousFiltersSnapshot);
    assert.ok(nextState.filters.onSaleOnly);
    assert.notEqual(nextState.filters, previousFilters);
  });
});
