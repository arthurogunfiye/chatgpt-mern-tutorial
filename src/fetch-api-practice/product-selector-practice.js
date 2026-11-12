import { selectProducts } from './product-selector.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);
const snapshot = structuredClone(products);

/* ======
  Test 1
========= */

const defaultFilters = {
  searchTerm: '',
  category: 'all',
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'default'
};

const defaultFiltersSnapshot = structuredClone(defaultFilters);

const array1 = selectProducts(products, defaultFilters);
console.log('Default filters:', array1);
console.assert(
  array1.length === 14 &&
    array1.every((product, index) => product.id === products[index].id),
  'Default filters failed'
);

/* ======
  Test 2
========= */

const onSaleOnlyFilter = {
  ...defaultFilters,
  onSaleOnly: true
};

const array2 = selectProducts(products, onSaleOnlyFilter);
console.log('On sale only filter:', array2);
console.assert(
  array2.length === 7 && array2.every(product => product.onSale),
  'On sale filter failed'
);

/* ======
  Test 3
========= */

const inStockOnlyFilter = {
  ...defaultFilters,
  inStockOnly: true
};

const array3 = selectProducts(products, inStockOnlyFilter);
console.log('In stock only filter:', array3);
console.assert(
  array3.length === 10 && array3.every(product => product.inStock),
  'In stock filter failed'
);

/* ======
  Test 4
========= */

const inStockAndOnSaleFilters = {
  ...defaultFilters,
  inStockOnly: true,
  onSaleOnly: true
};

const array4 = selectProducts(products, inStockAndOnSaleFilters);
console.log('In stock and on sale filters:', array4);
console.assert(
  array4.length === 4 &&
    array4.every(product => product.inStock && product.onSale),
  'In stock and on sale filtering failed'
);

/* ======
  Test 5
========= */

const accessoriesInStockAndOnSaleFilters = {
  ...defaultFilters,
  category: 'Accessories',
  inStockOnly: true,
  onSaleOnly: true
};

const array5 = selectProducts(products, accessoriesInStockAndOnSaleFilters);
console.log('Accessories in stock and on sale filters:', array5);
console.assert(
  array5.length === 1 &&
    array5.every(
      product =>
        product.category === 'Accessories' && product.inStock && product.onSale
    ),
  'Category, on sale and in stock filtering failed'
);

/* ======
  Test 6
========= */

const searchZzz = {
  ...defaultFilters,
  searchTerm: 'zzz'
};

const array6 = selectProducts(products, searchZzz);
console.log('Search zzz:', array6);
console.assert(array6.length === 0, 'Search failed');

/* ======
  Test 7
========= */

const caseInsensitivity = {
  ...defaultFilters,
  searchTerm: 'ElItE'
};

const array7 = selectProducts(products, caseInsensitivity);
console.log('Case insensitivity search:', array7);
console.assert(
  array7.length === 1 &&
    array7.every(product => product.name === 'HP EliteBook 8 G1i Laptop'),
  'Case insensitivity search failed'
);

/* ======
  Test 8
========= */

const spaceAroundSearchTerm = {
  ...defaultFilters,
  searchTerm: '  BoSe  '
};

const array8 = selectProducts(products, spaceAroundSearchTerm);
console.log('Space around search term:', array8);
console.assert(
  array8.length === 1 &&
    array8.every(
      product => product.name === 'Bose QuietComfort Ultra Headphones'
    ),
  'Space around search term failed'
);

/* ======
  Test 9
========= */

const sortPriceLowToHigh = {
  ...defaultFilters,
  sortBy: 'price-low'
};

const filtersSnapshot = structuredClone(sortPriceLowToHigh);

const array9 = selectProducts(products, sortPriceLowToHigh);

console.assert(
  JSON.stringify(sortPriceLowToHigh) === JSON.stringify(filtersSnapshot),
  'Failure: Filters modified'
);

console.log('Sorted by price low to high:', array9);
console.assert(
  array9.length === 14 &&
    array9.every((product, index, array) => {
      return index === 0 || array[index - 1].price <= product.price;
    }),
  'Sorting by price low to high failed'
);

/* ======
  Test 10
========= */

const sortPriceHighToLow = {
  ...defaultFilters,
  sortBy: 'price-high'
};

const array10 = selectProducts(products, sortPriceHighToLow);
console.log('Sorted by price high to low:', array10);
console.assert(
  array10.length === 14 &&
    array10.every((product, index, array) => {
      return index === 0 || array[index - 1].price >= product.price;
    }),
  'Sorting by price high to low failed'
);

/* ======
  Test 11
========= */

const sortAlphabetically = {
  ...defaultFilters,
  sortBy: 'a-z'
};

const array11 = selectProducts(products, sortAlphabetically);
console.log('Sorted alphabetically:', array11);
console.assert(
  array11.length === 14 &&
    array11.every((product, index, array) => {
      return (
        index === 0 || array[index - 1].name.localeCompare(product.name) <= 0
      );
    }),
  'Sorting alphabetically failed'
);

/* =======
  Test 12
========== */

console.assert(
  JSON.stringify(products) === JSON.stringify(snapshot) &&
    JSON.stringify(defaultFilters) === JSON.stringify(defaultFiltersSnapshot),
  'Original products and default filters were modified'
);
