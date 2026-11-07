import { fetchDiscountMock, fetchProductsMock } from './product-service.js';

async function loadProductsWithDiscount() {
  try {
    console.log('Fetching products...');

    const products = await fetchProductsMock();

    console.log('Products received:', products);

    console.log('Fetching discount...');

    const discount = await fetchDiscountMock();

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
    console.log('Operation completed');
  }
}

loadProductsWithDiscount();
