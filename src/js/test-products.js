// Array added for QA purposes

const testProducts = [
  {
    id: 101,
    name: 'HP EliteBook 8 G1i Laptop',
    price: 1713.59,
    category: 'Laptops',
    quantity: 5,
    inStock: true,
    onSale: true,
    discount: 15
  },
  {
    id: 102,
    name: 'Bose QuietComfort Ultra Headphones',
    price: 449.95,
    category: 'Accessories',
    quantity: 0,
    inStock: false,
    onSale: false,
    discount: 0
  },
  {
    id: 103,
    name: 'Toshiba Keyboard',
    price: 39,
    category: 'Accessories',
    quantity: 12,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 104,
    name: 'Samsung Monitor',
    price: 129,
    category: 'Accessories',
    quantity: 5,
    inStock: true,
    onSale: true,
    discount: 10
  },
  {
    id: 105,
    name: 'Apple iPhone 18 Pro',
    price: 1199,
    category: 'Smartphones',
    quantity: 25,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 106,
    name: 'Dell Pro 16 Plus Laptop',
    price: 1975.2,
    category: 'Laptops',
    quantity: 15,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 107,
    name: 'Samsung Galaxy S26 Ultra',
    price: 1529,
    category: 'Smartphones',
    quantity: 15,
    inStock: true,
    onSale: true,
    discount: 10
  },
  {
    id: 108,
    name: 'Apple iPad Air',
    price: 1199,
    category: 'Tablets',
    quantity: 15,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 109,
    name: 'Acer Aspire 14 AI Laptop',
    price: 749.99,
    category: 'Laptops',
    quantity: 12,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 110,
    name: 'Huawei Mate XT Phone',
    price: 1139.59,
    category: 'Smartphones',
    quantity: 8,
    inStock: true,
    onSale: false,
    discount: 0
  },
  {
    id: 111,
    name: 'Google Pixel Tablet',
    price: 599,
    category: 'Tablets',
    quantity: 15,
    inStock: true,
    onSale: true,
    discount: 5
  },
  {
    id: 112,
    name: 'HDMI Cable',
    price: 3.99,
    category: 'Accessories',
    quantity: 0,
    inStock: false,
    onSale: true,
    discount: 7
  },
  {
    id: 113,
    name: 'Samsung Galaxy Tab S12 Ultra',
    price: 1199,
    category: 'Tablets',
    quantity: 0,
    inStock: false,
    onSale: true,
    discount: 8
  },
  {
    id: 114,
    name: 'Google Pixel 11 Pro',
    price: 799,
    category: 'Smartphones',
    quantity: 0,
    inStock: false,
    onSale: true,
    discount: 15
  }
];

export function fetchTestProducts(shouldFail = false) {
  return new Promise((resolve, reject) => {
    if (shouldFail) {
      reject(new Error('Test products unavailable!'));
    } else {
      setTimeout(() => {
        resolve([...testProducts]);
      }, 5000);
    }
  });
}
