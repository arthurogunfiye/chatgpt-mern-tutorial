import { products } from '../../js/products.js';

// const testBtn = document.querySelector('.test-button');

export function fetchProductsMock(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Product service unavailable'));
      } else {
        resolve([...products]);
      }
    }, 1500);
  });
}

export function fetchDiscountMock() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}

// function runScenario(shouldFail = false) {
//   console.log('Loading MyStore products...');
//   fetchProductsMock(shouldFail)
//     .then(products => {
//       console.log('SUCCESS: ', products);
//     })
//     .catch(error => {
//       console.error('ERROR: ', error.message);
//     })
//     .finally(() => {
//       console.log('Product loading attempt completed');
//     });
// }

// runScenario();

// console.log('Just some random console log');

// testBtn.addEventListener('click', () => {
//   console.log('Test button clicked!');
// });

const start = performance.now();

fetchProductsMock()
  .then(() => {
    const elapsed = performance.now() - start;
    console.log(`Fetch products elapsed: ${elapsed.toFixed(1)} ms`);
  })
  .catch(error => {
    console.error(error.message);
  });

fetchDiscountMock()
  .then(() => {
    const elapsed = performance.now() - start;
    console.log(`Fetch discount elapsed: ${elapsed.toFixed(1)} ms`);
  })
  .catch(error => {
    console.error(error.message);
  });

// Measuring the actual elapsed time allows us to verify that the Promise settles after approximately 1,500 milliseconds, rather than merely confirming that it remains pending at 1,400 milliseconds. This helps identify both premature settlement and unexpectedly long delays.
