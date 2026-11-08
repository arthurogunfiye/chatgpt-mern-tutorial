import { loadProductsFromAPI } from './fetch-products-practice.js';

const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');

function renderProducts(products) {
  const productList = document.querySelector('#product-list');

  productList.replaceChildren();

  products.forEach(product => {
    const card = document.createElement('article');
    const name = document.createElement('h2');
    const price = document.createElement('p');
    const availability = document.createElement('p');
    const quantity = document.createElement('p');

    name.textContent = product.name;
    price.textContent = `Price: £${product.price.toFixed(2)}`;
    availability.textContent = product.inStock ? 'In stock' : 'Out of stock';
    quantity.textContent = `Available: ${product.quantity}`;

    card.append(name, price, availability, quantity);
    productList.append(card);
  });
}

async function displayProducts() {
  try {
    renderProducts(await loadProductsFromAPI());
  } catch (error) {
    errorMessage.hidden = false;
  } finally {
    loadingMessage.hidden = true;
  }
}

displayProducts();
