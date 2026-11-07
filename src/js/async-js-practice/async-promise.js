function getProductsAsync(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Unable to retrieve products'));
      } else {
        resolve([
          {
            id: 101,
            name: 'Samsung Galaxy S24',
            price: 899
          },
          {
            id: 107,
            name: 'Google Pixel Tablet',
            price: 329
          },
          {
            id: 104,
            name: 'Galaxy Ear Buds',
            price: 199
          },
          {
            id: 108,
            name: 'Bose Headphones',
            price: 299
          }
        ]);
      }
    }, 2000);
  });
}

function runScenario(shouldFail = false) {
  console.log('Loading MyStore products...');
  getProductsAsync(shouldFail)
    .then(products => {
      console.log('SUCCESS: ', products);
      return products.filter(product => product.price < 500);
    })
    .then(affordableProducts => {
      console.log('Products less than £500', affordableProducts);
      return [...affordableProducts].sort((a, b) => a.price - b.price);
    })
    .then(sortedProducts => {
      console.log(
        'Products sorted from cheapest to most expensive: ',
        sortedProducts
      );
    })
    .catch(error => {
      console.error('ERROR: ', error.message);
    })
    .finally(() => {
      console.log('Product loading attempt completed');
    });
}

runScenario();
