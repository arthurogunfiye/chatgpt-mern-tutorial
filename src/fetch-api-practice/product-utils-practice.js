import { fetchTestProducts } from '../js/test-products.js';
import {
  formatPrice,
  getCategories,
  getInStockProducts,
  getOutOfStockProducts,
  getProductsInStockAndOnSale,
  getProductsOutOfStockAndOnSale,
  getSaleProducts
} from './product-utils.js';

const products = await fetchTestProducts();
const snapshot = structuredClone(products);

console.log('Formatted price:', formatPrice(99.5));
console.assert(formatPrice(99.5) === '£99.50', 'Price formatting failed');

const categories = getCategories(products);
console.log('Categories:', categories);
console.assert(
  categories.length === 4,
  'No categories available or wrong categories returned'
);

console.assert(getCategories([]).length === 0, 'Empty category test failed');

console.assert(
  JSON.stringify(getCategories(products)) ===
    JSON.stringify(['Accessories', 'Laptops', 'Smartphones', 'Tablets']),
  'Categories are not sorted correctly'
);

const productsOnSale = getSaleProducts(products);
console.log('Products on sale:', productsOnSale);
console.assert(
  productsOnSale.length === 7 &&
    productsOnSale.every(product => product.onSale),
  'Sale filtering failed'
);

const productsInStock = getInStockProducts(products);
console.log('Products in stock:', productsInStock);
console.assert(
  productsInStock.length === 10 &&
    productsInStock.every(product => product.inStock),
  'In stock filtering failed'
);

const productsOutOfStock = getOutOfStockProducts(products);
console.log('Products out of stock:', productsOutOfStock);
console.assert(
  productsOutOfStock.length === 4 &&
    productsOutOfStock.every(product => !product.inStock),
  'Out of stock filtering failed'
);

const productsInStockAndOnSale = getProductsInStockAndOnSale(products);
console.log('Products in stock and on sale:', productsInStockAndOnSale);
console.assert(
  productsInStockAndOnSale.length === 4 &&
    productsInStockAndOnSale.every(
      product => product.inStock && product.onSale
    ),
  'In stock and on sale filtering failed'
);

const productsOutOfStockAndOnSale = getProductsOutOfStockAndOnSale(products);
console.log('Products out of stock and on sale:', productsOutOfStockAndOnSale);
console.assert(
  productsOutOfStockAndOnSale.length === 3 &&
    productsOutOfStockAndOnSale.every(
      product => !product.inStock && product.onSale
    ),
  'Out of stock and on sale filtering failed'
);

getInStockProducts(products);
getSaleProducts(products);
getCategories(products);
getInStockProducts(products);
getOutOfStockProducts(products);
getProductsInStockAndOnSale(products);
getProductsOutOfStockAndOnSale(products);

console.assert(
  JSON.stringify(products) === JSON.stringify(snapshot),
  'Original products were modified'
);
