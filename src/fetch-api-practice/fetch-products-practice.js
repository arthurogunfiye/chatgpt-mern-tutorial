export async function loadProductsFromAPI() {
  try {
    console.log('Fetching MyStore products from API...');
    const response = await fetch('https://dummyjson.com/products?limit=10');

    // Added to elicit an empty products array response
    // const response = await fetch(
    //   'https://dummyjson.com/products?limit=8&skip=1000'
    // );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const products = data.products;

    console.log('Products received from API: ', products);
    console.log('Number of products: ', products.length);

    const simplifiedPdtsArray = products.map(product => {
      const { id, title, price, stock, discountPercentage, category } = product;
      const discount =
        typeof discountPercentage === 'number' &&
        Number.isFinite(discountPercentage) &&
        discountPercentage > 0
          ? discountPercentage
          : 0;
      return {
        id,
        name: title,
        category,
        price,
        inStock: stock > 0,
        quantity: stock,
        onSale: discount > 0,
        discount
      };
    });

    console.log('Simplified products: ', simplifiedPdtsArray);
    return simplifiedPdtsArray;
  } catch (error) {
    console.error('ERROR: ', error.message);
    throw error;
  } finally {
    console.log('Product API request completed');
  }
}
