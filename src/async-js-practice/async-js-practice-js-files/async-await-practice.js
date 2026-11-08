import { fetchProductsMock } from './product-service.js';

async function loadProductsAsync(shouldFail = false) {
  console.log('Loading MyStore products...');
  try {
    const products = await fetchProductsMock(shouldFail);
    console.log('SUCCESS: ', products);
  } catch (error) {
    console.error('ERROR: ', error.message);
  } finally {
    console.log('Product loading attempt completed');
  }
}

loadProductsAsync(true);
