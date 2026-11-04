'use strict';
import { products } from './products.js';

const resetCartBtns = document.querySelectorAll('.reset-cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let cartCount = 0;

function updateCartCount() {
  document
    .querySelectorAll('#cart-count, #mobile-cart-count')
    .forEach(element => {
      element.textContent = `Cart: ${cartCount}`;
    });
}

function logProductSelection(productId) {
  console.log(`User selected product ${productId}`);
}

function resetCart() {
  cartCount = 0;
  updateCartCount();
  console.log('Cart reset');
}

resetCartBtns.forEach(button => {
  button.addEventListener('click', resetCart);
});

addToCartButtons.forEach(button => {
  button.addEventListener('click', event => {
    const rawProductId = event.currentTarget.dataset.productId;
    const productId = Number(rawProductId);

    if (!rawProductId || !Number.isSafeInteger(productId) || productId <= 0) {
      console.error('Invalid product ID');
      return;
    }

    const product = products.find(pdt => pdt.id === productId);

    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }

    if (!product.inStock) {
      console.warn(`${product.name} is out of stock`);
      return;
    }

    cartCount += 1;
    updateCartCount();
    logProductSelection(productId);
  });
});
