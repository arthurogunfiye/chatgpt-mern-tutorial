export function formatPrice(price) {
  return price.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });
}

export function getCategories(products) {
  return [...new Set(products.map(product => product.category))].sort();
}

export function getInStockProducts(products) {
  return products.filter(product => product.inStock);
}

export function getOutOfStockProducts(products) {
  return products.filter(product => !product.inStock);
}

export function getProductsInStockAndOnSale(products) {
  return products.filter(product => product.inStock && product.onSale);
}

export function getProductsOutOfStockAndOnSale(products) {
  return products.filter(product => !product.inStock && product.onSale);
}

export function getSaleProducts(products) {
  return products.filter(product => product.onSale);
}
