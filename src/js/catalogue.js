import { products } from './products.js';

const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-products');
const availabilityFilter = document.querySelector('#availability-filter');
const productsContainer = document.querySelector('.products-list');
const resultsElement = document.querySelector('#product-results');
const clearFiltersBtn = document.querySelector('#clear-filters');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

const productCards = new Map(
  [...productsContainer.querySelectorAll('.product-card')].map(card => {
    const button = card.querySelector('.add-to-cart');
    return [Number(button.dataset.productId), card];
  })
);

function filterProducts(category) {
  if (category === 'all') {
    return products;
  }

  return products.filter(product => product.category === category);
}

function sortProducts(productsList, sortBy) {
  const sortedProducts = [...productsList];

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);

    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);

    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sortedProducts;
  }
}

function filterProductsByAvailability(productsList, availability) {
  switch (availability) {
    case 'inStock':
      return productsList.filter(pdt => pdt.inStock && pdt.quantity > 0);

    case 'outOfStock':
      return productsList.filter(pdt => !pdt.inStock || pdt.quantity <= 0);

    default:
      return productsList;
  }
}

function clearFilters() {
  categoryFilter.value = 'all';
  sortSelect.value = 'default';
  availabilityFilter.value = 'all';

  updateProductView();
  categoryFilter.focus();
}

function updateClearFiltersButton() {
  const hasActiveFilters =
    categoryFilter.value !== 'all' ||
    sortSelect.value !== 'default' ||
    availabilityFilter.value !== 'all';

  clearFiltersBtn.disabled = !hasActiveFilters;
}

function updateProductView() {
  const category = categoryFilter.value;
  const sortBy = sortSelect.value;
  const availability = availabilityFilter.value;

  const filteredProducts = filterProducts(category);
  const availableProducts = filterProductsByAvailability(
    filteredProducts,
    availability
  );
  const sortedProducts = sortProducts(availableProducts, sortBy);

  const visibleCards = sortedProducts
    .map(product => productCards.get(product.id))
    .filter(Boolean);

  if (visibleCards.length === 0) {
    const message = document.createElement('p');
    message.className = 'no-products';
    message.textContent = 'No products match your filters.';
    productsContainer.replaceChildren(message);
  } else {
    productsContainer.replaceChildren(...visibleCards);
  }

  resultsElement.textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'product' : 'products'} found`;

  updateClearFiltersButton();
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

export function initCatalogue() {
  categoryFilter.addEventListener('change', updateProductView);
  sortSelect.addEventListener('change', updateProductView);
  availabilityFilter.addEventListener('change', updateProductView);
  clearFiltersBtn.addEventListener('click', clearFilters);

  [categoryFilter, sortSelect, availabilityFilter].forEach(select => {
    select.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        select.showPicker();
      }
    });
  });

  updateStockStatus();
  updateProductView();
}
