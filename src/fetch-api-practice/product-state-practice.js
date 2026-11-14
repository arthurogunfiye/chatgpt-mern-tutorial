import { initialState, productReducer } from './product-state.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);
const initialStateSnapshot = structuredClone(initialState);

/* =======
  TEST 1
========== */

const categoryFilterState = productReducer(initialState, {
  type: 'SET_FILTER',
  payload: {
    key: 'category',
    value: 'Laptops'
  }
});

console.assert(
  categoryFilterState.filters.category === 'Laptops',
  'Category filtering failed'
);

/* =======
  TEST 2
========== */

const searchState = productReducer(categoryFilterState, {
  type: 'SET_FILTER',
  payload: {
    key: 'searchTerm',
    value: 'Samsung'
  }
});

console.assert(
  searchState.filters.category === 'Laptops' &&
    searchState.filters.searchTerm === 'Samsung',
  'Search and category filtering failed'
);

/* =======
  TEST 3
========== */

const stockOnlyState = productReducer(searchState, {
  type: 'SET_FILTER',
  payload: {
    key: 'inStockOnly',
    value: true
  }
});

console.assert(
  stockOnlyState.filters.category === 'Laptops' &&
    stockOnlyState.filters.searchTerm === 'Samsung' &&
    stockOnlyState.filters.inStockOnly,
  'Search, category and in stock filtering failed'
);

/* =======
  TEST 4
========== */

const productsLoaded = productReducer(initialState, {
  type: 'LOAD_SUCCESS',
  payload: products
});

const modifiedFilterState1 = productReducer(productsLoaded, {
  type: 'SET_FILTER',
  payload: {
    key: 'category',
    value: 'Laptops'
  }
});

const modifiedFilterState2 = productReducer(modifiedFilterState1, {
  type: 'SET_FILTER',
  payload: {
    key: 'searchTerm',
    value: 'Dell'
  }
});

const resetState = productReducer(modifiedFilterState2, {
  type: 'RESET_FILTERS'
});

console.assert(
  resetState.products.length === 14 &&
    JSON.stringify(resetState.filters) ===
      JSON.stringify(initialStateSnapshot.filters),
  'Failure: Initial state modified!'
);

/* =======
  TEST 5
========== */

const loadingState = productReducer(initialState, {
  type: 'LOAD_START'
});

console.assert(
  loadingState.status.isLoading === true && loadingState.status.error === null,
  'Loading state failed'
);

/* =======
  TEST 6
========== */

const loadedState = productReducer(loadingState, {
  type: 'LOAD_SUCCESS',
  payload: products
});

console.assert(
  loadedState.products.length === 14 &&
    loadedState.products.every(
      (product, index) => product.id === products[index].id
    ) &&
    loadedState.status.isLoading === false &&
    loadedState.status.error === null,
  'Wrong products received'
);

/* =======
  TEST 7
========== */

const errorMsg = 'Network down. Service unavailable.';

const errorState = productReducer(loadedState, {
  type: 'LOAD_FAILURE',
  payload: errorMsg
});

console.assert(
  errorState.status.error === errorMsg &&
    errorState.products.length === 14 &&
    errorState.status.isLoading === false,
  'No error state triggered'
);

/* =======
  TEST 8
========== */

const unknownAction = productReducer(initialState, {
  type: 'UNKNOWN_ACTION',
  payload: {
    key: 'searchTerm',
    value: 'Bose'
  }
});

console.assert(
  unknownAction === initialState,
  'Failure: Unknown action did not return the original state'
);

/* =======
  TEST 9
========== */

console.assert(
  JSON.stringify(initialState) === JSON.stringify(initialStateSnapshot),
  'Failure: Initial state modified!'
);

/* =======
  TEST 10
========== */

console.assert(
  JSON.stringify(initialState.filters) ===
    JSON.stringify(initialStateSnapshot.filters),
  'Failure: Initial state filters modified!'
);
