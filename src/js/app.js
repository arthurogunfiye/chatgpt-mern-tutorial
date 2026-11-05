'use strict';
import { products } from './products.js';
import { initCatalogue } from './catalogue.js';

const resetCartBtns = document.querySelectorAll('.reset-cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const productsList = document.querySelector('.products-list');

let cart = [];

function addToCart(productId) {
  const product = products.find(pdt => pdt.id === productId);

  if (!product) {
    console.log(`Product with ID ${productId} not found!`);
    return;
  }

  if (!product.inStock || product.quantity <= 0) {
    console.warn(`Product with ID ${productId} is out of stock`);
    return;
  }

  const existingCartItem = cart.find(item => item.productId === productId);

  if (existingCartItem) {
    increaseQuantity(productId);
    return;
  }

  cart.push({
    productId,
    quantity: 1
  });

  updateCartDisplay();
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce(
    (total, item) => total + getItemSubtotal(item.productId),
    0
  );
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
    label.className = 'cart-item-name';
    label.textContent = `${product.name}`;

    const itemSubtotalElement = document.createElement('p');
    itemSubtotalElement.className = 'cart-item-subtotal';
    const itemPrice = document.createElement('span');
    const itemQty = document.createElement('span');
    const subtotalElement = document.createElement('span');
    itemPrice.textContent = `£${product.price}`;
    itemQty.textContent = `${item.quantity} * `;
    subtotalElement.textContent = ` = ${formatPrice(getItemSubtotal(product.id))}`;
    itemSubtotalElement.append(itemQty, itemPrice, subtotalElement);

    const increaseItemQtyBtn = document.createElement('button');
    increaseItemQtyBtn.type = 'button';
    increaseItemQtyBtn.textContent = '+';
    increaseItemQtyBtn.setAttribute(
      'aria-label',
      `Increase quantity of ${product.name}`
    );

    increaseItemQtyBtn.addEventListener('click', () =>
      increaseQuantity(product.id)
    );

    const decreaseItemQtyBtn = document.createElement('button');
    decreaseItemQtyBtn.type = 'button';
    decreaseItemQtyBtn.textContent = '-';
    decreaseItemQtyBtn.setAttribute(
      'aria-label',
      `Decrease quantity of ${product.name}`
    );

    decreaseItemQtyBtn.addEventListener('click', () =>
      decreaseQuantity(product.id)
    );

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove ${product.name} from cart`);

    removeButton.addEventListener('click', () => {
      removeFromCart(product.id);
    });

    row.append(
      label,
      itemSubtotalElement,
      increaseItemQtyBtn,
      decreaseItemQtyBtn,
      removeButton
    );
    cartItemsElement.append(row);
  });

  cartTotalElement.textContent = formatPrice(getCartTotal());
}

function updateCartDisplay() {
  updateCartCount();
  renderCart();
}

function resetCart() {
  cart = [];
  updateCartDisplay();
  console.log('Cart reset');
}

resetCartBtns.forEach(button => {
  button.addEventListener('click', resetCart);
});

productsList.addEventListener('click', event => {
  const button = event.target.closest('.add-to-cart');

  if (!button || !productsList.contains(button)) return;

  const rawProductId = button.dataset.productId;
  const productId = Number(rawProductId);

  if (!rawProductId || !Number.isSafeInteger(productId) || productId <= 0) {
    console.error('Invalid product ID');
    return;
  }

  addToCart(productId);
});

function increaseQuantity(productId) {
  const itemInCart = cart.find(cartItem => cartItem.productId === productId);

  if (!itemInCart) return;

  const product = products.find(pdt => pdt.id === itemInCart.productId);

  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }

  if (itemInCart.quantity >= product.quantity) {
    console.warn(
      `You have reached the maximum quantity of ${product.name} in stock`
    );
    return;
  }

  itemInCart.quantity += 1;

  updateCartDisplay();
}

function decreaseQuantity(productId) {
  const itemInCart = cart.find(cartItem => cartItem.productId === productId);

  if (!itemInCart) return;

  if (itemInCart.quantity === 1) {
    removeFromCart(productId);
    return;
  }

  itemInCart.quantity -= 1;

  updateCartDisplay();
}

function formatPrice(amount) {
  return amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP'
  });
}

function getItemSubtotal(productId) {
  const itemInCart = cart.find(cartItem => cartItem.productId === productId);
  const product = products.find(pdt => pdt.id === productId);

  if (!itemInCart || !product) return 0;

  return product.price * itemInCart.quantity;
}

function renderProductQuantity(button, product) {
  const quantityElement = button
    .closest('.product-card')
    .querySelector('.product-quantity');

  const statusElement = document.createElement('span');

  if (product.inStock) {
    statusElement.className = 'quantity';
    statusElement.textContent = product.quantity;
    quantityElement.replaceChildren('In Stock: ', statusElement);
  } else {
    statusElement.className = 'out-of-stock';
    statusElement.textContent = 'Out of stock';
    quantityElement.replaceChildren(statusElement);
  }
}

function updateStockStatus() {
  addToCartButtons.forEach(button => {
    const productId = Number(button.dataset.productId);
    const product = products.find(pdt => pdt.id === productId);

    if (!product) {
      console.error(`Product with ID ${productId} not found!`);
      button.disabled = true;
      button.textContent = 'Unavailable';
      return;
    }

    const available = product.inStock && product.quantity > 0;

    button.disabled = !available;
    button.textContent = available ? 'Add To Cart' : 'Out Of Stock';
    renderProductQuantity(button, product);
  });
}

initCatalogue();
updateCartDisplay();
updateStockStatus();
