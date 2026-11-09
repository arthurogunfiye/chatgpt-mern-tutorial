import { loadProductsFromAPI } from './fetch-products-practice.js';

const productList = document.querySelector('#product-list');
const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');
const noPdtsMsg = document.querySelector('#no-products-message');

function renderProducts(products) {
  productList.replaceChildren();

  products.forEach(product => {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const name = document.createElement('h2');
    name.textContent = product.name;

    const price = document.createElement('p');
    price.classList.add('product-price');
    price.textContent = `Price: £${product.price.toFixed(2)}`;

    const availability = document.createElement('p');
    availability.classList.add(product.inStock ? 'in-stock' : 'out-of-stock');
    availability.textContent = product.inStock ? 'In stock' : 'Out of stock';

    card.append(name, price, availability);

    if (product.inStock) {
      const quantity = document.createElement('p');
      quantity.textContent = `Available: ${product.quantity}`;
      card.append(quantity);
    }

    if (product.onSale && product.discount > 0) {
      const sale = document.createElement('p');
      sale.classList.add('sale-badge');
      sale.textContent = `${Math.round(product.discount)}% OFF`;
      card.append(sale);
    }

    productList.append(card);
  });
}

async function displayProducts() {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;
  noPdtsMsg.hidden = true;

  productList.replaceChildren();

  try {
    const products = await loadProductsFromAPI();

    if (products.length === 0) {
      noPdtsMsg.textContent = 'There are no products available';
      noPdtsMsg.hidden = false;
      return;
    }

    renderProducts(products);
  } catch (error) {
    console.error('Unable to load products:', error);
    errorMessage.hidden = false;
  } finally {
    loadingMessage.hidden = true;
  }
}

displayProducts();
