import { loadProductsFromAPI } from './fetch-products-practice.js';
// import { fetchTestProducts } from '../js/test-products.js';

const productList = document.querySelector('#product-list');
const loadingMessage = document.querySelector('#loading-message');
const errorMessage = document.querySelector('#error-message');
const noPdtsMsg = document.querySelector('#no-products-message');

const searchInput = document.querySelector('#product-search');
const stockFilter = document.querySelector('#stock-filter');
const saleFilter = document.querySelector('#sale-filter');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-products');
const resetFiltersBtn = document.querySelector('#reset-filters-btn');
const productsCounter = document.querySelector('#products-counter');
const tryAgainBtn = document.querySelector('#try-again-btn');

searchInput.addEventListener('input', updateCatalogue);
stockFilter.addEventListener('change', updateCatalogue);
sortSelect.addEventListener('change', updateCatalogue);
saleFilter.addEventListener('change', updateCatalogue);
categoryFilter.addEventListener('change', updateCatalogue);
resetFiltersBtn.addEventListener('click', resetFilters);
tryAgainBtn.addEventListener('click', displayProducts);

let allProducts = [];
let isLoading = false;

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

    const matchesSale = !saleFilter.checked || product.onSale;

    return matchesSearch && matchesCategory && matchesStock && matchesSale;
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

function resetFilters() {
  searchInput.value = '';
  sortSelect.value = 'default';
  categoryFilter.value = 'all';
  stockFilter.checked = false;
  saleFilter.checked = false;

  updateCatalogue();
  searchInput.focus();
}

function updateCatalogue() {
  const visibleProducts = getVisibleProducts();

  productsCounter.textContent = `Showing ${visibleProducts.length} of ${allProducts.length} products`;

  if (allProducts.length === 0) {
    productList.replaceChildren();
    noPdtsMsg.textContent = 'There are no products available.';
    noPdtsMsg.hidden = false;
    return;
  }

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

function setControlsDisabled(isDisabled) {
  [
    searchInput,
    sortSelect,
    categoryFilter,
    stockFilter,
    saleFilter,
    resetFiltersBtn
  ].forEach(element => {
    element.disabled = isDisabled;
  });
}

async function displayProducts() {
  if (isLoading) return;

  setControlsDisabled(true);
  loadingMessage.hidden = false;
  errorMessage.hidden = true;
  noPdtsMsg.hidden = true;
  tryAgainBtn.hidden = true;

  productList.replaceChildren();

  isLoading = true;
  tryAgainBtn.disabled = true;

  try {
    const products = await loadProductsFromAPI();

    // For QA testing with local data, temporarily use:
    // const products = await fetchTestProducts(false);

    allProducts = products;

    if (allProducts.length > 0) setControlsDisabled(true);
    populateCategories(allProducts);
    updateCatalogue();
  } catch (error) {
    console.error('Unable to load products:', error);
    allProducts = [];
    productsCounter.textContent = '';
    errorMessage.hidden = false;
    tryAgainBtn.hidden = false;
  } finally {
    loadingMessage.hidden = true;
    isLoading = false;
    tryAgainBtn.disabled = false;
  }
}

displayProducts();
