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
    const products = await fetch(
      `https://dummyjson.com/products?limit=12&skip=${skip}`
    ).then((res) => res.json());
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetProduct = async (id: string) => {
  try {
    const products = await fetch(`https://dummyjson.com/products/${id}`).then(
      (res) => res.json()
    );
    return products;
  } catch (error) {
    console.log(error);
  }
};

export const fetchSearchProduct = async (name: string) => {
  try {
    const products = await fetch(
      `https://dummyjson.com/products/search?q=${name}`
    ).then((res) => res.json());
    return products;
  } catch (error) {
    console.log(error);
  }
};
