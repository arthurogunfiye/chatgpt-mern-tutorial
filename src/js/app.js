'use strict';
import { products } from './products.js';

const resetCartBtns = document.querySelectorAll('.reset-cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let cart = [];

function addToCart(productId) {
  const product = products.find(pdt => pdt.id === productId);

  if (!product) {
    console.log(`Product with ID ${productId} not found!`);
    return;
  }

  if (!product.inStock) {
    console.warn(`Product with ID ${productId} is out of stock`);
  }

  const existingPdtIndex = cart.findIndex(item => item.productId === productId);

  if (existingPdtIndex !== -1) {
    cart[existingPdtIndex].quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1
    });
  }

  updateCartDisplay();
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find(pdt => pdt.id === item.productId);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.productId === productId);

  if (index === -1) return;
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateCartCount() {
  const count = getCartCount();
  document
    .querySelectorAll('#cart-count, #mobile-cart-count')
    .forEach(element => {
      element.textContent = `Cart: ${count}`;
    });
}

function renderCart() {
  const cartItemsElement = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');

  cartItemsElement.replaceChildren();

  if (cart.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Your cart is empty.';
    cartItemsElement.append(message);
  }

  cart.forEach(item => {
    const product = products.find(pdt => pdt.id === item.productId);

    if (!product) return;

    const row = document.createElement('div');
    row.className = 'cart-item';

    const label = document.createElement('span');
    label.textContent = `${product.name} * ${item.quantity} — £${product.price * item.quantity}`;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${product.name} from cart`);

    removeButton.addEventListener('click', () => {
      removeFromCart(product.id);
    });

    row.append(label, removeButton);
    cartItemsElement.append(row);
  });

  cartTotalElement.textContent = getCartTotal().toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });
}

function updateCartDisplay() {
  updateCartCount();
  renderCart();
}

function logProductSelection(productId) {
  console.log(`User selected product ${productId}`);
}

function resetCart() {
  cart = [];
  updateCartDisplay();
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

    addToCart(productId);
  });
});

updateCartDisplay();
