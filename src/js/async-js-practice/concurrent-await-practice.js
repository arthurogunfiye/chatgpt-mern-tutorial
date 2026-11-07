import { fetchDiscountMock, fetchProductsMock } from './product-service.js';

async function loadProductsConcurrently() {
  const start = performance.now();
  try {
    console.log('Fetching products and discount concurrently...');

    const [products, discount] = await Promise.all([
      fetchProductsMock(),
      fetchDiscountMock()
    ]);

    console.log('Products received:', products);
    console.log('Discount received:', discount);

    const discountedPricesArr = products.map(product => {
      if (!product.onSale) {
        console.log(`No discount applied as ${product.name} is not on sale`);
        return {
          ...product,
          discountedPrice: product.price
        };
      }

      const discountedPrice = product.price * (1 - discount / 100);

      console.log(
        `Discounted price for ${product.name} is £${discountedPrice.toFixed(2)}`
      );

      return {
        ...product,
        discountedPrice: Number(discountedPrice.toFixed(2))
      };
    });
    console.log('Discounted products array:', discountedPricesArr);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    const elapsed = performance.now() - start;
    console.log(`Concurrent elapsed duration: ${elapsed.toFixed(1)}ms`);
    console.log('Operation completed');
  }
}

loadProductsConcurrently();
