export const calTotalPrice = (price: number, discountPercentage: number) => {
  const totalPrice = Number((price * (1 - discountPercentage / 100)).toFixed(2));
  return totalPrice;
};
