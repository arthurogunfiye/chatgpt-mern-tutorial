export function selectProducts(products, filters) {
  const { searchTerm, category, inStockOnly, onSaleOnly, sortBy } = filters;

  const normalisedSearchTerm = searchTerm.trim().toLowerCase();

  const visibleProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(normalisedSearchTerm);

    const matchesCategory = category === 'all' || product.category === category;

    const matchesStock = !inStockOnly || product.inStock;

    const matchesSale = !onSaleOnly || product.onSale;

    return matchesSearch && matchesCategory && matchesStock && matchesSale;
  });

  if (sortBy === 'price-low') {
    visibleProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === 'price-high') {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  if (sortBy === 'a-z') {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return visibleProducts;
}
