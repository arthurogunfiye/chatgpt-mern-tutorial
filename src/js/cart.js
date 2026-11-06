import { products } from './products.js';

const CART_STORAGE_KEY = 'mystore-cart-v1';
const SAVED_ITEMS_STORAGE_KEY = 'mystore-saved-items-v1';

const resetCartBtns = document.querySelectorAll('.reset-cart');
const productsList = document.querySelector('.products-list');

let cart = [];
let savedItems = [];

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
    itemPrice.textContent = formatPrice(product.price);
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

    const saveForLaterButton = document.createElement('button');
    saveForLaterButton.type = 'button';
    saveForLaterButton.textContent = 'Save For Later';
    saveForLaterButton.setAttribute(
      'aria-label',
      `Save ${product.name} for later`
    );

    saveForLaterButton.addEventListener('click', () =>
      saveForLater(product.id)
    );

    row.append(
      label,
      itemSubtotalElement,
      increaseItemQtyBtn,
      decreaseItemQtyBtn,
      removeButton,
      saveForLaterButton
    );
    cartItemsElement.append(row);
  });

  cartTotalElement.textContent = formatPrice(getCartTotal());
}

function updateCartDisplay() {
  updateCartCount();
  renderCart();
  saveCart();
}

function resetCart() {
  cart = [];
  updateCartDisplay();
}

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

function saveCart() {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (error) {
    console.error('Unable to save cart: ', error);
  }
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart === null) return [];

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) return [];

    const validCart = [];

    for (const item of parsedCart) {
      if (!item || typeof item !== 'object') continue;

      const product = products.find(pdt => pdt.id === item.productId);

      if (
        !product ||
        !product.inStock ||
        !Number.isSafeInteger(product.quantity) ||
        product.quantity <= 0
      ) {
        continue;
      }

      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) continue;

      const existingItem = validCart.find(
        cartItem => cartItem.productId === product.id
      );

      const remainingStock = product.quantity - (existingItem?.quantity ?? 0);

      if (remainingStock <= 0) continue;

      const quantity = Math.min(item.quantity, remainingStock);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        validCart.push({
          productId: product.id,
          quantity
        });
      }
    }

    return validCart;
  } catch (error) {
    console.error('Unable to load cart: ', error);
    return [];
  }
}

function saveForLater(productId) {
  const cartItem = cart.find(item => item.productId === productId);

  if (!cartItem) return;

  const product = products.find(pdt => pdt.id === productId);

  if (!product) return;

  const itemExistingInSavedItems = savedItems.find(
    item => item.productId === productId
  );

  if (itemExistingInSavedItems) {
    itemExistingInSavedItems.quantity = Math.min(
      itemExistingInSavedItems.quantity + cartItem.quantity,
      product.quantity
    );
  } else {
    savedItems.push({
      productId,
      quantity: cartItem.quantity
    });
  }

  removeFromCart(productId);

  updateSavedItemsDisplay();
}

function moveToCart(productId) {
  const savedItem = savedItems.find(item => item.productId === productId);

  if (!savedItem) return;

  const product = products.find(pdt => pdt.id === productId);

  if (!product || !product.inStock) return;

  const existingCartItem = cart.find(item => item.productId === productId);

  const numberOfItemsInCart = existingCartItem?.quantity ?? 0;
  const spaceLeftInCart = product.quantity - numberOfItemsInCart;
  const quantityToMoveToCart = Math.min(savedItem.quantity, spaceLeftInCart);

  if (quantityToMoveToCart <= 0) return;

  if (existingCartItem) {
    existingCartItem.quantity += quantityToMoveToCart;
  } else {
    cart.push({
      productId,
      quantity: quantityToMoveToCart
    });
  }

  savedItem.quantity -= quantityToMoveToCart;

  if (savedItem.quantity === 0) removeItemFromSavedItems(productId);

  updateCartDisplay();
  updateSavedItemsDisplay();
}

function removeItemFromSavedItems(productId) {
  const index = savedItems.findIndex(item => item.productId === productId);

  if (index === -1) return;

  savedItems.splice(index, 1);
}

function saveSavedItems() {
  try {
    const serializedSavedItems = JSON.stringify(savedItems);
    localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, serializedSavedItems);
  } catch (error) {
    console.error('Unable to save saved items: ', error);
  }
}

function loadSavedItems() {
  try {
    const savedSavedItems = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);

    if (savedSavedItems === null) return [];

    const parsedSavedItems = JSON.parse(savedSavedItems);

    if (!Array.isArray(parsedSavedItems)) return [];

    const validSavedItems = [];

    for (const savedItem of parsedSavedItems) {
      if (!savedItem || typeof savedItem !== 'object') continue;

      if (!Number.isSafeInteger(savedItem.quantity) || savedItem.quantity <= 0)
        continue;

      const product = products.find(pdt => pdt.id === savedItem.productId);

      if (!product) continue;

      const existingSavedItem = validSavedItems.find(
        validItem => validItem.productId === product.id
      );

      if (existingSavedItem) {
        existingSavedItem.quantity += savedItem.quantity;
      } else {
        validSavedItems.push({
          productId: product.id,
          quantity: savedItem.quantity
        });
      }
    }

    return validSavedItems;
  } catch (error) {
    console.error('Unable to load saved items: ', error);
    return [];
  }
}

function updateSavedItemsDisplay() {
  renderSavedItems();
  saveSavedItems();
}

function renderSavedItems() {
  const savedItemsEl = document.querySelector('#saved-items');

  savedItemsEl.replaceChildren();

  if (savedItems.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'You have no saved items.';
    savedItemsEl.append(message);
  }

  savedItems.forEach(item => {
    const product = products.find(pdt => pdt.id === item.productId);

    if (!product) return;

    const row = document.createElement('div');
    row.className = 'saved-item';

    const productNameEl = document.createElement('span');
    productNameEl.className = 'saved-item-name';
    productNameEl.textContent = `${product.name}`;

    const productQuantity = document.createElement('span');
    productQuantity.className = 'saved-item-quantity';
    productQuantity.textContent = `Quantity: ${item.quantity}`;

    const moveToCartBtn = document.createElement('button');
    moveToCartBtn.type = 'button';
    moveToCartBtn.className = 'move-to-cart-btn';
    moveToCartBtn.setAttribute('aria-label', `Move ${product.name} to cart`);
    moveToCartBtn.textContent = 'Move To Cart';

    moveToCartBtn.addEventListener('click', () => moveToCart(product.id));

    row.append(productNameEl, productQuantity, moveToCartBtn);

    savedItemsEl.append(row);
  });
}

export function initCart() {
  cart = loadCart();
  savedItems = loadSavedItems();

  resetCartBtns.forEach(button => {
    button.addEventListener('click', resetCart);
  });

  productsList.addEventListener('click', event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest('.add-to-cart');

    if (!button || !productsList.contains(button) || button.disabled) {
      return;
    }

    const rawProductId = button.dataset.productId;
    const productId = Number(rawProductId);

    if (!rawProductId || !Number.isSafeInteger(productId) || productId <= 0) {
      console.error('Invalid product ID');
      return;
    }

    addToCart(productId);
  });

  updateCartDisplay();
  updateSavedItemsDisplay();
}
