export const fetchGetAllProducts = async () => {
  try {
    const products = await fetch("https://dummyjson.com/products").then((res) =>
      res.json()
    );
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetProductsEachPage = async (skip: number) => {
  try {
    const products = await fetch(`https://dummyjson.com/products?limit=12&skip=${skip}`).then((res) =>
      res.json()
    );
    return products;
  } catch (error) {
    console.log(error);
  }
};