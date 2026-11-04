export const products = [
  {
    id: 101,
    name: 'Samsung Galaxy S24',
    category: 'Smartphones',
    price: 899,
    inStock: true,
    onSale: true
  },
  {
    id: 102,
    name: 'HP Laptop',
    category: 'Laptops',
    price: 749,
    inStock: true,
    onSale: false
  },
  {
    id: 103,
    name: 'Apple iPad',
    category: 'Tablets',
    price: 599,
    inStock: true,
    onSale: false
  },
  {
    id: 104,
    name: 'Galaxy Ear Buds',
    category: 'Accessories',
    price: 199,
    inStock: true,
    onSale: false
  },
  {
    id: 105,
    name: 'Apple iPhone 18 Pro Max',
    category: 'Smartphones',
    price: 999,
    inStock: true,
    onSale: true
  },
  {
    id: 106,
    name: 'Dell Latitude 5440 Laptop',
    category: 'Laptops',
    price: 789,
    inStock: false,
    onSale: false
  },
  {
    id: 107,
    name: 'Google Pixel Tablet',
    category: 'Tablets',
    price: 329,
    inStock: true,
    onSale: true
  },
  {
    id: 108,
    name: 'Bose Headphones',
    category: 'Accessories',
    price: 299,
    inStock: false,
    onSale: false
  }
];

const productsBelow600 = products.filter(pdt => pdt.price < 600);
console.log(`Products below £600: ${JSON.stringify(productsBelow600)}`);

const productWithId106 = products.find(pdt => pdt.id === 106);
console.log(`Product with id 106: ${JSON.stringify(productWithId106)}`);

const productsNames = products.map(pdt => pdt.name);
console.log(`Product names: ${productsNames}`);

const total = products.reduce((sum, pdt) => sum + pdt.price, 0);
console.log(`Price total: ${total}`);

const getProductsByCategory = category =>
  products.filter(pdt => pdt.category === category);

console.log(getProductsByCategory('Tablets'));
