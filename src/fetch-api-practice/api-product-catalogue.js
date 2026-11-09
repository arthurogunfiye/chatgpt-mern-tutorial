import { loadProductsFromAPI } from './fetch-products-practice.js';
import { testProducts } from '../js/test-products.js';

const productList = document.querySelector('#product-list');
const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');
const noPdtsMsg = document.querySelector('#no-products-message');

const searchInput = document.querySelector('#product-search');
const stockFilter = document.querySelector('#stock-filter');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-products');

searchInput.addEventListener('input', updateCatalogue);
stockFilter.addEventListener('change', updateCatalogue);
sortSelect.addEventListener('change', updateCatalogue);
categoryFilter.addEventListener('change', updateCatalogue);

let allProducts = [];

function populateCategories(products) {
  const categories = [...new Set(products.map(product => product.category))];

  categories.sort();

  categoryFilter.replaceChildren();

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All categories';
  categoryFilter.append(allOption);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.append(option);
  });
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  let visibleProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesStock = !stockFilter.checked || product.inStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (sortSelect.value === 'price-low') {
    visibleProducts.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === 'price-high') {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  if (sortSelect.value === 'a-z') {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return visibleProducts;
}

function updateCatalogue() {
  const visibleProducts = getVisibleProducts();

  if (visibleProducts.length === 0) {
    productList.replaceChildren();
    noPdtsMsg.textContent = 'No products match your search or filters.';
    noPdtsMsg.hidden = false;
    return;
  }

  noPdtsMsg.hidden = true;
  renderProducts(visibleProducts);
}

function renderProducts(products) {
  productList.replaceChildren();

  products.forEach(product => {
    const card = document.createElement('article');
    card.classList.add('product-card');

    const name = document.createElement('h2');
    name.classList.add('product-name');
    name.textContent = product.name;

    const category = document.createElement('p');
    category.classList.add('product-category');
    category.textContent = `Category: ${product.category}`;

    const price = document.createElement('p');
    price.classList.add('product-price');
    price.textContent = `Price: £${product.price.toFixed(2)}`;

    const availability = document.createElement('p');
    availability.classList.add(product.inStock ? 'in-stock' : 'out-of-stock');
    availability.textContent = product.inStock ? 'In stock' : 'Out of stock';

    card.append(name, price, category, availability);

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
    // Use this for normal API testing:
    // const products = await loadProductsFromAPI();

    // For QA testing with local data, temporarily use:
    const products = testProducts;

    allProducts = products;

    // Populate the dropdown BEFORE checking for an empty array.
    populateCategories(allProducts);

    if (allProducts.length === 0) {
      noPdtsMsg.textContent = 'There are no products available';
      noPdtsMsg.hidden = false;
      return;
    }

    updateCatalogue();
  } catch (error) {
    console.error('Unable to load products:', error);
    errorMessage.hidden = false;
  } finally {
    loadingMessage.hidden = true;
  }
}

displayProducts();
