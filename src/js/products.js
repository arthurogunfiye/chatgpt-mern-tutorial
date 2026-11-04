const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-products');
const productsContainer = document.querySelector('.products-list');
const resultsElement = document.querySelector('#product-results');

export const products = [
  {
    id: 101,
    name: 'Samsung Galaxy S24',
    category: 'Smartphones',
    price: 899,
    quantity: 5,
    inStock: true,
    onSale: true
  },
  {
    id: 102,
    name: 'HP Laptop',
    category: 'Laptops',
    price: 749,
    quantity: 7,
    inStock: true,
    onSale: false
  },
  {
    id: 103,
    name: 'Apple iPad',
    category: 'Tablets',
    price: 599,
    quantity: 0,
    inStock: false,
    onSale: false
  },
  {
    id: 104,
    name: 'Galaxy Ear Buds',
    category: 'Accessories',
    price: 199,
    quantity: 6,
    inStock: true,
    onSale: false
  },
  {
    id: 105,
    name: 'Apple iPhone 18 Pro Max',
    category: 'Smartphones',
    price: 999,
    quantity: 8,
    inStock: true,
    onSale: true
  },
  {
    id: 106,
    name: 'Dell Latitude 5440 Laptop',
    category: 'Laptops',
    price: 789,
    quantity: 0,
    inStock: false,
    onSale: false
  },
  {
    id: 107,
    name: 'Google Pixel Tablet',
    category: 'Tablets',
    price: 329,
    quantity: 5,
    inStock: true,
    onSale: true
  },
  {
    id: 108,
    name: 'Bose Headphones',
    category: 'Accessories',
    price: 299,
    quantity: 0,
    inStock: false,
    onSale: false
  }
];

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

function updateProductView() {
  const category = categoryFilter.value;
  const sortBy = sortSelect.value;

  const filteredProducts = filterProducts(category);
  const sortedProducts = sortProducts(filteredProducts, sortBy);

  const cards = new Map(
    [...productsContainer.querySelectorAll('.product-card')].map(card => {
      const button = card.querySelector('.add-to-cart');
      return [Number(button.dataset.productId), card];
    })
  );

  const visibleCards = sortedProducts
    .map(product => productCards.get(product.id))
    .filter(Boolean);

  productsContainer.replaceChildren(...visibleCards);

  resultsElement.textContent = `${visibleCards.length} products found`;
}

const productCards = new Map(
  [...productsContainer.querySelectorAll('.product-card')].map(card => {
    const button = card.querySelector('.add-to-cart');
    return [Number(button.dataset.productId), card];
  })
);

categoryFilter.addEventListener('change', updateProductView);

sortSelect.addEventListener('change', updateProductView);

updateProductView();

/* =============
    CHALLENGES
  ============== */

// const productsBelow600 = products.filter(pdt => pdt.price < 600);
// console.log(`Products below £600: ${JSON.stringify(productsBelow600)}`);

// const productWithId106 = products.find(pdt => pdt.id === 106);
// console.log(`Product with id 106: ${JSON.stringify(productWithId106)}`);

// const productsNames = products.map(pdt => pdt.name);
// console.log(`Product names: ${productsNames}`);

// const total = products.reduce((sum, pdt) => sum + pdt.price, 0);
// console.log(`Price total: ${total}`);

// const getProductsByCategory = category =>
//   products.filter(pdt => pdt.category === category);

// console.log(getProductsByCategory('Tablets'));

/* ========
    NOTES
  ========= */

// Sorting arranges elements in a specified order.

// For example:
// const numbers = [50, 10, 100, 5];

// numbers.sort((a, b) => a - b);

// console.log(numbers);
// [5, 10, 50, 100]

// Without a comparison function, JavaScript's default sort() compares elements as strings, which is often unsuitable for numbers.

// How the comparison callback works
// For a - b:
// - A negative result means a should come before b.
// - A positive result means b should come before a.
// - Zero means they compare equally for sorting purposes.
// For descending order, reverse the subtraction:

// numbers.sort((a, b) => b - a);

// Important: sort() mutates the array being sorted. We don't want customers' sorting choices to permanently reorder our original product catalogue.
