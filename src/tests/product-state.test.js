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

    assert.deepEqual(nextState.filters, {
      ...previousState.filters,
      category: 'Laptops'
    });
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

  it('Reset should preserve products', () => {
    const previousState = createState({
      products,
      filters: {
        searchTerm: 'sa',
        sortBy: 'price-high',
        inStockOnly: true
      }
    });

    const action = {
      type: 'RESET_FILTERS'
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.products.length, 14);
    assert.deepEqual(
      nextState.products.map(pdt => pdt.id),
      previousState.products.map(pdt => pdt.id)
    );
  });

  it('LOAD_START should set loading and clear error', () => {
    const previousState = createState({
      status: {
        isLoading: false,
        error: 'Previous network failure'
      }
    });

    const previousStateSnapshot = structuredClone(previousState);

    const action = {
      type: 'LOAD_START'
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.status.isLoading, true);
    assert.equal(nextState.status.error, null);
    assert.deepEqual(previousState, previousStateSnapshot);
  });

  it('LOAD_SUCCESS should store products and clear loading', () => {
    const previousState = createState({
      status: {
        isLoading: true,
        error: 'Network unavailable'
      }
    });

    const previousStateSnapshot = structuredClone(previousState);

    const action = {
      type: 'LOAD_SUCCESS',
      payload: products
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.products.length, 14);
    assert.deepEqual(
      nextState.products.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
    assert.equal(nextState.status.isLoading, false);
    assert.equal(nextState.status.error, null);
    assert.deepEqual(previousState, previousStateSnapshot);
  });

  it('LOAD_FAILURE should store error and preserve products', () => {
    const previousState = createState({
      products,
      status: {
        isLoading: true,
        error: null
      }
    });

    const previousStateSnapshot = structuredClone(previousState);

    const errorMsg = 'Network down. Service unavailable.';

    const action = {
      type: 'LOAD_FAILURE',
      payload: errorMsg
    };

    const nextState = productReducer(previousState, action);

    assert.equal(nextState.status.error, errorMsg);
    assert.equal(nextState.products.length, 14);
    assert.equal(nextState.status.isLoading, false);
    assert.deepEqual(previousState, previousStateSnapshot);
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

    const nextState = productReducer(previousState, action);

    assert.deepEqual(previousFilters, previousFiltersSnapshot);
    assert.equal(nextState.filters.onSaleOnly, true);
    assert.notEqual(nextState.filters, previousFilters);
  });
});
