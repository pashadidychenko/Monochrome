function getStatistic(productData) {
  const category = Array.from(
    new Set(productData.map((product) => product.category))
  );
  let result = [];
  category.map((categ) => {
    let filteredProduct = productData.filter(
      (product) => product.category === categ
    );
    let price = filteredProduct.map((el) => el.price);
    let maxPrice = Math.max(...price);
    let minPrice = Math.min(...price);
    let averageСost = price.reduce((acc, b) => acc + b, 0) / price.length;
    let quantity = filteredProduct.reduce((acc, el) => acc + el.summary, 0);
    let summaryPrice = filteredProduct.reduce(
      (acc, el) => acc + el.price * el.summary,
      0
    );

    result.push({
      category: categ,
      quantity,
      average: parseFloat(averageСost.toFixed(2)),
      minPrice,
      maxPrice,
      summaryPrice,
    });
  });

  return result;
}

module.exports = getStatistic;
