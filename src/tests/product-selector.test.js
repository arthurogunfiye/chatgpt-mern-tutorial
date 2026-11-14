import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { selectProducts } from '../fetch-api-practice/product-selector.js';
import { fetchTestProducts } from '../js/test-products.js';

const products = await fetchTestProducts(false);
const productsSnapshot = structuredClone(products);

function createFilters(overrides = {}) {
  return {
    searchTerm: '',
    category: 'all',
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'default',
    ...overrides
  };
}

describe('selectProducts()', () => {
  it('default filters should return all the products in the original order', () => {
    const result = selectProducts(products, createFilters());

    assert.equal(result.length, 14);
    assert.deepEqual(
      result.map(pdt => pdt.id),
      products.map(pdt => pdt.id)
    );
  });

  it('On sale filter should return 7 matching products', () => {
    const result = selectProducts(
      products,
      createFilters({ onSaleOnly: true })
    );

    assert.equal(result.length, 7);
    assert.ok(result.every(pdt => pdt.onSale));
  });

  it('In stock filter should return 10 matching products', () => {
    const result = selectProducts(
      products,
      createFilters({ inStockOnly: true })
    );

    assert.equal(result.length, 10);
    assert.ok(result.every(pdt => pdt.inStock));
  });

  it('In stock and on sale filters should return 4 matching products', () => {
    const result = selectProducts(
      products,
      createFilters({ inStockOnly: true, onSaleOnly: true })
    );

    assert.equal(result.length, 4);
    assert.ok(result.every(pdt => pdt.inStock && pdt.onSale));
  });

  it('Category, in stock and on sale filters should return 1 matching product', () => {
    const result = selectProducts(
      products,
      createFilters({
        category: 'Accessories',
        inStockOnly: true,
        onSaleOnly: true
      })
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'Samsung Monitor');
    assert.ok(
      result.every(
        pdt => pdt.category === 'Accessories' && pdt.inStock && pdt.onSale
      )
    );
  });

  it('Unmatched search should return an empty array', () => {
    const result = selectProducts(
      products,
      createFilters({
        searchTerm: 'zzz'
      })
    );

    assert.deepEqual(result, []);
  });

  it('Case insensitive search should return matching product', () => {
    const result = selectProducts(
      products,
      createFilters({
        searchTerm: 'ElIte'
      })
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'HP EliteBook 8 G1i Laptop');
  });

  it('Whitespace trimming search should return matching products', () => {
    const result = selectProducts(
      products,
      createFilters({
        searchTerm: '  bose  '
      })
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'Bose QuietComfort Ultra Headphones');
  });

  it('Should sort products with price ascending', () => {
    const result = selectProducts(
      products,
      createFilters({
        sortBy: 'price-low'
      })
    );

    const prices = [
      3.99, 39, 129, 449.95, 599, 749.99, 799, 1139.59, 1199, 1199, 1199, 1529,
      1713.59, 1975.2
    ];

    assert.equal(result.length, 14);
    assert.deepEqual(
      result.map(pdt => pdt.price),
      prices
    );
  });

  it('Should sort products with price descending', () => {
    const result = selectProducts(
      products,
      createFilters({
        sortBy: 'price-high'
      })
    );

    const prices = [
      1975.2, 1713.59, 1529, 1199, 1199, 1199, 1139.59, 799, 749.99, 599,
      449.95, 129, 39, 3.99
    ];

    assert.equal(result.length, 14);
    assert.deepEqual(
      result.map(pdt => pdt.price),
      prices
    );
  });

  it('Should sort products alphabetically', () => {
    const result = selectProducts(
      products,
      createFilters({
        sortBy: 'a-z'
      })
    );

    const alphabeticalNames = [
      'Acer Aspire 14 AI Laptop',
      'Apple iPad Air',
      'Apple iPhone 18 Pro',
      'Bose QuietComfort Ultra Headphones',
      'Dell Pro 16 Plus Laptop',
      'Google Pixel 11 Pro',
      'Google Pixel Tablet',
      'HDMI Cable',
      'HP EliteBook 8 G1i Laptop',
      'Huawei Mate XT Phone',
      'Samsung Galaxy S26 Ultra',
      'Samsung Galaxy Tab S12 Ultra',
      'Samsung Monitor',
      'Toshiba Keyboard'
    ];

    assert.equal(result.length, 14);
    assert.deepEqual(
      result.map(pdt => pdt.name),
      alphabeticalNames
    );
  });

  it('Should maintain input immutability', () => {
    const filters = createFilters({
      searchTerm: 'sa',
      sortBy: 'price-high',
      inStockOnly: true,
      onSaleOnly: true
    });

    const filtersSnapshot = structuredClone(filters);

    const result = selectProducts(products, filters);

    assert.equal(result.length, 2);
    assert.deepEqual(products, productsSnapshot);
    assert.deepEqual(filters, filtersSnapshot);
  });
});
